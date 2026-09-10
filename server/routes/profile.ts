import { Router, Request, Response } from 'express';
import { db } from '../db.ts';
import { authenticate, AuthRequest } from '../auth.ts';

const router = Router();

// GET /api/profile - current user's profile
router.get('/profile', authenticate, (req: AuthRequest, res: Response) => {
  const profile = db.findProfileByUserId(req.user!._id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found. Please create one.' });
  }
  return res.json({ profile });
});

// PUT /api/profile - update current user's profile
router.put('/profile', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let profile = db.findProfileByUserId(user._id);

    if (!profile) {
      // Create if doesn't exist
      profile = db.createProfile({
        userId: user._id,
        fullName: req.body.fullName || user.username,
        gender: req.body.gender || 'Female',
        dob: req.body.dob || '1998-01-01',
        age: req.body.age || 27,
        maritalStatus: req.body.maritalStatus || 'Never Married',
        religion: req.body.religion || 'Hindu',
        caste: req.body.caste || '',
        motherTongue: req.body.motherTongue || 'Hindi',
        nationality: req.body.nationality || 'Indian',
        qualification: req.body.qualification || '',
        college: req.body.college || '',
        occupation: req.body.occupation || '',
        height: req.body.height || "5'6\"",
        weight: req.body.weight || '58 kg',
        foodPreference: req.body.foodPreference || 'Vegetarian',
        smokingStatus: req.body.smokingStatus || 'No',
        drinkingStatus: req.body.drinkingStatus || 'No',
        city: req.body.city || '',
        state: req.body.state || '',
        country: req.body.country || 'India',
        bio: req.body.bio || '',
        hobbies: req.body.hobbies || [],
        profilePhoto: req.body.profilePhoto || '',
        photos: req.body.photos || [],
        isVerified: false,
        profileCompletion: 50,
        partnerPreferences: req.body.partnerPreferences || { ageMin: 24, ageMax: 34 }
      });
      return res.json({ message: 'Profile created successfully', profile });
    }

    // Update existing
    const updates = { ...req.body };
    delete updates._id;
    delete updates.userId;
    delete updates.isVerified; // Admin verifies

    // Recalculate age if dob is updated
    if (updates.dob) {
      const birthDate = new Date(updates.dob);
      const diff = Date.now() - birthDate.getTime();
      const ageDate = new Date(diff);
      updates.age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const updated = db.updateProfile(profile._id, updates);
    return res.json({ message: 'Profile updated successfully!', profile: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error updating profile' });
  }
});

// DELETE /api/profile
router.delete('/profile', authenticate, (req: AuthRequest, res: Response) => {
  const profile = db.findProfileByUserId(req.user!._id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  db.deleteProfile(profile._id);
  return res.json({ message: 'Profile deleted successfully' });
});

// GET /api/profiles - Search & discover
router.get('/profiles', (req: Request, res: Response) => {
  try {
    const {
      q,
      gender,
      ageMin,
      ageMax,
      religion,
      caste,
      occupation,
      education,
      city,
      state,
      country,
      maritalStatus,
      foodPreference,
      verifiedOnly,
      excludeUserId
    } = req.query;

    const allUsers = db.getUsers();
    const activeUserIds = new Set(
      allUsers.filter(u => u.status === 'active' && u.role === 'user').map(u => u._id)
    );

    let profiles = db.getProfiles().filter(p => activeUserIds.has(p.userId));

    if (excludeUserId) {
      profiles = profiles.filter(p => p.userId !== excludeUserId);
    }

    // Text search query
    if (q && typeof q === 'string' && q.trim()) {
      const term = q.toLowerCase().trim();
      profiles = profiles.filter(
        p =>
          p.fullName.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.occupation.toLowerCase().includes(term) ||
          p.qualification.toLowerCase().includes(term) ||
          p.religion.toLowerCase().includes(term) ||
          p.caste.toLowerCase().includes(term) ||
          p.bio.toLowerCase().includes(term)
      );
    }

    // Gender filter
    if (gender && typeof gender === 'string' && gender !== 'All') {
      profiles = profiles.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    }

    // Age range
    if (ageMin) {
      const min = parseInt(ageMin as string, 10);
      if (!isNaN(min)) profiles = profiles.filter(p => p.age >= min);
    }
    if (ageMax) {
      const max = parseInt(ageMax as string, 10);
      if (!isNaN(max)) profiles = profiles.filter(p => p.age <= max);
    }

    // Religion
    if (religion && typeof religion === 'string' && religion !== 'All') {
      profiles = profiles.filter(p => p.religion.toLowerCase() === religion.toLowerCase());
    }

    // Caste
    if (caste && typeof caste === 'string' && caste.trim()) {
      profiles = profiles.filter(p => p.caste.toLowerCase().includes(caste.toLowerCase().trim()));
    }

    // Location
    if (city && typeof city === 'string' && city.trim()) {
      profiles = profiles.filter(p => p.city.toLowerCase().includes(city.toLowerCase().trim()));
    }
    if (state && typeof state === 'string' && state.trim()) {
      profiles = profiles.filter(p => p.state.toLowerCase().includes(state.toLowerCase().trim()));
    }
    if (country && typeof country === 'string' && country.trim()) {
      profiles = profiles.filter(p => p.country.toLowerCase().includes(country.toLowerCase().trim()));
    }

    // Occupation
    if (occupation && typeof occupation === 'string' && occupation.trim()) {
      profiles = profiles.filter(p => p.occupation.toLowerCase().includes(occupation.toLowerCase().trim()));
    }

    // Education
    if (education && typeof education === 'string' && education.trim()) {
      profiles = profiles.filter(p => p.qualification.toLowerCase().includes(education.toLowerCase().trim()));
    }

    // Marital Status
    if (maritalStatus && typeof maritalStatus === 'string' && maritalStatus !== 'All') {
      profiles = profiles.filter(p => p.maritalStatus.toLowerCase() === maritalStatus.toLowerCase());
    }

    // Food preference
    if (foodPreference && typeof foodPreference === 'string' && foodPreference !== 'All') {
      profiles = profiles.filter(p => p.foodPreference.toLowerCase() === foodPreference.toLowerCase());
    }

    // Verified only
    if (verifiedOnly === 'true' || verifiedOnly === '1') {
      profiles = profiles.filter(p => p.isVerified);
    }

    return res.json({
      total: profiles.length,
      profiles
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error searching profiles' });
  }
});

// GET /api/profiles/:id - Single Profile Detail
router.get('/profiles/:id', (req: Request, res: Response) => {
  const profile = db.findProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const user = db.findUserById(profile.userId);
  if (!user || user.status === 'suspended') {
    return res.status(404).json({ error: 'Profile not available' });
  }

  return res.json({ profile });
});

export default router;
