import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, Profile, Interest, Favorite, MediaPhoto, PasswordResetToken } from './types.ts';
import { initialUsers, initialProfiles, initialInterests, initialFavorites } from './seed.ts';

interface DatabaseSchema {
  users: User[];
  profiles: Profile[];
  interests: Interest[];
  favorites: Favorite[];
  resetTokens: PasswordResetToken[];
}

class Database {
  private data: DatabaseSchema;
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), '.data', 'db.json');
    this.data = {
      users: [...initialUsers],
      profiles: [...initialProfiles],
      interests: [...initialInterests],
      favorites: [...initialFavorites],
      resetTokens: []
    };
    this.init();
  }

  private init() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.profiles) {
          this.data = parsed;
        }
      } else {
        this.save();
      }

      this.sanitizeRolesAndIntegrity();
    } catch (err) {
      console.warn('Could not load existing db.json, using seed memory:', err);
    }
  }

  private sanitizeRolesAndIntegrity() {
    let modified = false;

    // 1. Sanitize roles: ensure all users have strictly 'user' or 'admin'
    for (const u of this.data.users) {
      if (u.role !== 'admin' && u.role !== 'user') {
        u.role = 'user';
        modified = true;
      }
    }

    // 2. Cascade integrity: remove any orphan profiles missing active users
    const userIds = new Set(this.data.users.map(u => u._id));
    const initialProfileCount = this.data.profiles.length;
    this.data.profiles = this.data.profiles.filter(p => userIds.has(p.userId));
    if (this.data.profiles.length !== initialProfileCount) modified = true;

    // 3. Cascade integrity: remove any orphan interests
    const initialInterestCount = this.data.interests.length;
    this.data.interests = this.data.interests.filter(
      i => userIds.has(i.fromUserId) && userIds.has(i.toUserId)
    );
    if (this.data.interests.length !== initialInterestCount) modified = true;

    // 4. Cascade integrity: remove any orphan favorites
    const initialFavCount = this.data.favorites.length;
    this.data.favorites = this.data.favorites.filter(f => userIds.has(f.userId));
    if (this.data.favorites.length !== initialFavCount) modified = true;

    if (modified) {
      this.save();
    }
  }

  private save() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return this.data.users;
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find(u => u._id === id);
  }

  findUserByEmailOrUsername(identifier: string): User | undefined {
    const lower = identifier.toLowerCase().trim();
    return this.data.users.find(
      u => u.email.toLowerCase() === lower || u.username.toLowerCase() === lower
    );
  }

  createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      _id: `usr-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  deleteUser(id: string): boolean {
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx === -1) return false;
    this.data.users.splice(idx, 1);
    this.data.profiles = this.data.profiles.filter(p => p.userId !== id);
    this.data.interests = this.data.interests.filter(i => i.fromUserId !== id && i.toUserId !== id);
    this.data.favorites = this.data.favorites.filter(f => f.userId !== id);
    this.save();
    return true;
  }

  // --- Profiles ---
  getProfiles(): Profile[] {
    return this.data.profiles;
  }

  findProfileById(id: string): Profile | undefined {
    return this.data.profiles.find(p => p._id === id);
  }

  findProfileByUserId(userId: string): Profile | undefined {
    return this.data.profiles.find(p => p.userId === userId);
  }

  createProfile(profile: Omit<Profile, '_id' | 'createdAt' | 'updatedAt'>): Profile {
    const newProfile: Profile = {
      ...profile,
      _id: `prof-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.calculateCompletion(newProfile);
    this.data.profiles.push(newProfile);
    this.save();
    return newProfile;
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const profile = this.findProfileById(id);
    if (!profile) return undefined;
    Object.assign(profile, updates, { updatedAt: new Date().toISOString() });
    this.calculateCompletion(profile);
    this.save();
    return profile;
  }

  calculateCompletion(profile: Profile): number {
    let score = 0;
    // Basic (20%)
    if (profile.fullName && profile.gender && profile.dob) score += 20;
    // Personal (20%)
    if (profile.religion && profile.motherTongue) score += 20;
    // Education & Career (20%)
    if (profile.qualification && profile.occupation) score += 20;
    // Lifestyle & Location (20%)
    if (profile.city && profile.foodPreference && profile.height) score += 20;
    // Photos & Bio (20%)
    if (profile.profilePhoto || profile.photos.length > 0) score += 10;
    if (profile.bio && profile.bio.length > 20) score += 10;

    profile.profileCompletion = Math.min(score, 100);
    return profile.profileCompletion;
  }

  deleteProfile(id: string): boolean {
    const idx = this.data.profiles.findIndex(p => p._id === id);
    if (idx === -1) return false;
    this.data.profiles.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Interests ---
  getInterests(): Interest[] {
    return this.data.interests;
  }

  getUserInterests(userId: string): { sent: Interest[]; received: Interest[] } {
    const sent = this.data.interests.filter(i => i.fromUserId === userId);
    const received = this.data.interests.filter(i => i.toUserId === userId);
    return { sent, received };
  }

  createInterest(interest: Omit<Interest, '_id' | 'createdAt' | 'updatedAt'>): Interest {
    // Check if interest already exists
    const existing = this.data.interests.find(
      i => i.fromUserId === interest.fromUserId && i.toProfileId === interest.toProfileId
    );
    if (existing) {
      existing.status = 'pending';
      if (interest.message) existing.message = interest.message;
      existing.updatedAt = new Date().toISOString();
      this.save();
      return existing;
    }

    const newInterest: Interest = {
      ...interest,
      _id: `int-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.interests.push(newInterest);
    this.save();
    return newInterest;
  }

  updateInterestStatus(id: string, status: 'accepted' | 'rejected' | 'pending'): Interest | undefined {
    const item = this.data.interests.find(i => i._id === id);
    if (!item) return undefined;
    item.status = status;
    item.updatedAt = new Date().toISOString();
    this.save();
    return item;
  }

  deleteInterest(id: string): boolean {
    const idx = this.data.interests.findIndex(i => i._id === id);
    if (idx === -1) return false;
    this.data.interests.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Favorites ---
  getFavorites(userId: string): Favorite[] {
    return this.data.favorites.filter(f => f.userId === userId);
  }

  addFavorite(userId: string, profileId: string): Favorite {
    const existing = this.data.favorites.find(f => f.userId === userId && f.profileId === profileId);
    if (existing) return existing;
    const newFav: Favorite = {
      _id: `fav-${crypto.randomUUID()}`,
      userId,
      profileId,
      createdAt: new Date().toISOString()
    };
    this.data.favorites.push(newFav);
    this.save();
    return newFav;
  }

  removeFavorite(userId: string, profileId: string): boolean {
    const idx = this.data.favorites.findIndex(f => f.userId === userId && f.profileId === profileId);
    if (idx === -1) return false;
    this.data.favorites.splice(idx, 1);
    this.save();
    return true;
  }

  // --- Media Photos ---
  getAllMedia(): { photo: MediaPhoto; profile: Profile; user: User }[] {
    const results: { photo: MediaPhoto; profile: Profile; user: User }[] = [];
    for (const profile of this.data.profiles) {
      const user = this.findUserById(profile.userId);
      if (!user) continue;
      for (const photo of profile.photos) {
        results.push({ photo, profile, user });
      }
    }
    return results;
  }

  updatePhotoStatus(photoId: string, status: 'approved' | 'rejected', reason?: string): MediaPhoto | null {
    for (const profile of this.data.profiles) {
      const photo = profile.photos.find(p => p.id === photoId);
      if (photo) {
        photo.status = status;
        if (reason) photo.rejectedReason = reason;
        if (status === 'approved' && !profile.profilePhoto) {
          profile.profilePhoto = photo.url;
        }
        this.save();
        return photo;
      }
    }
    return null;
  }

  deletePhoto(profileId: string, photoId: string): boolean {
    const profile = this.findProfileById(profileId);
    if (!profile) return false;
    const idx = profile.photos.findIndex(p => p.id === photoId);
    if (idx === -1) return false;
    const removed = profile.photos.splice(idx, 1)[0];
    if (profile.profilePhoto === removed.url) {
      const nextApproved = profile.photos.find(p => p.status === 'approved');
      profile.profilePhoto = nextApproved ? nextApproved.url : '';
    }
    this.calculateCompletion(profile);
    this.save();
    return true;
  }

  // --- Password Reset ---
  createResetToken(email: string): { token: string; otp: string } {
    const token = crypto.randomBytes(24).toString('hex');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    // Remove older tokens for this email
    this.data.resetTokens = this.data.resetTokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());
    this.data.resetTokens.push({ token, otp, email, expiresAt });
    this.save();
    return { token, otp };
  }

  verifyAndResetPassword(email: string, otpOrToken: string, newPasswordHash: string): boolean {
    const now = Date.now();
    const match = this.data.resetTokens.find(
      t =>
        t.email.toLowerCase() === email.toLowerCase() &&
        (t.otp === otpOrToken || t.token === otpOrToken) &&
        t.expiresAt > now
    );
    if (!match) return false;

    const user = this.findUserByEmailOrUsername(email);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date().toISOString();

    this.data.resetTokens = this.data.resetTokens.filter(t => t !== match);
    this.save();
    return true;
  }
}

export const db = new Database();
