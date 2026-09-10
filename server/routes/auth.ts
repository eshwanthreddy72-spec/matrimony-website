import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { hashPassword, verifyPassword, generateToken, authenticate, AuthRequest } from '../auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  try {
    const { fullName, email, username, password, confirmPassword, gender } = req.body;

    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ error: 'Full Name, Email, Username, and Password are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingEmail = db.findUserByEmailOrUsername(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const existingUsername = db.findUserByEmailOrUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'This username is already taken. Please choose another.' });
    }

    const passwordHash = hashPassword(password);
    const user = db.createUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'user',
      status: 'active'
    });

    // Create initial profile
    const profile = db.createProfile({
      userId: user._id,
      fullName: fullName.trim(),
      gender: gender || 'Female',
      dob: '1998-01-01',
      age: 27,
      maritalStatus: 'Never Married',
      religion: 'Hindu',
      caste: '',
      motherTongue: 'Hindi',
      nationality: 'Indian',
      qualification: '',
      college: '',
      occupation: '',
      height: "5'6\"",
      weight: '60 kg',
      foodPreference: 'Vegetarian',
      smokingStatus: 'No',
      drinkingStatus: 'No',
      city: '',
      state: '',
      country: 'India',
      bio: '',
      hobbies: [],
      profilePhoto: '',
      photos: [],
      isVerified: false,
      profileCompletion: 30,
      partnerPreferences: {
        ageMin: 24,
        ageMax: 32
      }
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      },
      profile
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and Password are required.' });
    }

    const user = db.findUserByEmailOrUsername(identifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password.' });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email/username or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account is suspended. Please contact support.' });
    }

    const token = generateToken(user);
    const profile = db.findProfileByUserId(user._id);

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      },
      profile
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /api/auth/admin/login
router.post('/admin/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Admin Email/Username and Password are required.' });
    }

    const user = db.findUserByEmailOrUsername(identifier);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin credentials or insufficient rights.' });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Admin access granted!',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const profile = db.findProfileByUserId(user._id);
  return res.json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    },
    profile
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const user = db.findUserByEmailOrUsername(email);
  if (!user) {
    // Return friendly message without revealing user existence
    return res.json({
      message: 'If an account exists with this email, an OTP and reset instructions have been generated.'
    });
  }

  const { token } = db.createResetToken(user.email);
  return res.json({
    message: `A 6-digit verification OTP has been sent to ${user.email}.`,
    resetToken: token
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req: Request, res: Response) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const newHash = hashPassword(newPassword);
  const success = db.verifyAndResetPassword(email, otp, newHash);
  if (!success) {
    return res.status(400).json({ error: 'Invalid or expired OTP. Please request a new one.' });
  }

  return res.json({ message: 'Password has been successfully reset! You can now log in.' });
});

export default router;
