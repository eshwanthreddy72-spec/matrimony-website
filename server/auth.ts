import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from './db.ts';
import { User } from './types.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'matrimony-secret-key-prod-random-2026';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
  } catch {
    return false;
  }
}

export interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
  email: string;
  exp: number;
}

export function generateToken(user: User): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload: JwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${encodedPayload}`)
    .digest('base64url');
  return `${header}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const decodedPayload: JwtPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decodedPayload;
  } catch {
    return null;
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  const user = db.findUserById(payload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Your account has been suspended by administration.' });
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
    }
    next();
  });
}
