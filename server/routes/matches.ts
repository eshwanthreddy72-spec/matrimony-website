import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticate, AuthRequest } from '../auth.ts';
import { Profile } from '../types.ts';

const router = Router();

export interface MatchRecommendation {
  profile: Profile;
  compatibilityScore: number;
  matchReasons: string[];
}

function calculateCompatibility(userProf: Profile, targetProf: Profile): { score: number; reasons: string[] } {
  let score = 50; // baseline
  const reasons: string[] = [];

  // Age check
  const prefs = userProf.partnerPreferences || { ageMin: 22, ageMax: 35 };
  if (targetProf.age >= prefs.ageMin && targetProf.age <= prefs.ageMax) {
    score += 15;
    reasons.push(`Within preferred age bracket (${prefs.ageMin}-${prefs.ageMax})`);
  }

  // Religion / community
  if (prefs.religions && prefs.religions.length > 0) {
    if (prefs.religions.includes('Any') || prefs.religions.includes(targetProf.religion)) {
      score += 10;
      reasons.push(`Matches preferred faith (${targetProf.religion})`);
    }
  } else if (userProf.religion === targetProf.religion) {
    score += 10;
    reasons.push(`Shared cultural & spiritual values (${targetProf.religion})`);
  }

  // Location
  if (userProf.city.toLowerCase() === targetProf.city.toLowerCase()) {
    score += 12;
    reasons.push(`Located in the same city (${targetProf.city})`);
  } else if (userProf.state.toLowerCase() === targetProf.state.toLowerCase()) {
    score += 6;
    reasons.push(`Located in the same state (${targetProf.state})`);
  }

  // Education / Career
  if (userProf.qualification && targetProf.qualification) {
    score += 8;
    reasons.push('Complementary educational qualification');
  }

  // Lifestyle - Food & habits
  if (userProf.foodPreference === targetProf.foodPreference) {
    score += 5;
    reasons.push(`Compatible food preference (${targetProf.foodPreference})`);
  }
  if (userProf.smokingStatus === 'No' && targetProf.smokingStatus === 'No') {
    score += 5;
  }

  // Hobbies overlap
  const commonHobbies = userProf.hobbies.filter(h =>
    targetProf.hobbies.some(th => th.toLowerCase() === h.toLowerCase())
  );
  if (commonHobbies.length > 0) {
    score += 8;
    reasons.push(`Shared interests: ${commonHobbies.slice(0, 2).join(', ')}`);
  }

  // Verification bonus
  if (targetProf.isVerified) {
    score += 5;
    reasons.push('Verified authentic profile');
  }

  return {
    score: Math.min(score, 99),
    reasons
  };
}

// GET /api/matches - Match Recommendations
router.get('/matches', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const userProfile = db.findProfileByUserId(currentUserId);

  if (!userProfile) {
    return res.status(404).json({ error: 'Please set up your profile to receive match suggestions.' });
  }

  const allUsers = db.getUsers();
  const activeUserIds = new Set(
    allUsers.filter(u => u.status === 'active' && u.role === 'user').map(u => u._id)
  );

  // Filter out self and same gender by default (or opposite gender)
  const targetGender = userProfile.gender === 'Male' ? 'Female' : 'Male';

  const potentialProfiles = db.getProfiles().filter(
    p =>
      p.userId !== currentUserId &&
      activeUserIds.has(p.userId) &&
      p.gender === targetGender
  );

  const recommendations: MatchRecommendation[] = potentialProfiles
    .map(profile => {
      const { score, reasons } = calculateCompatibility(userProfile, profile);
      return {
        profile,
        compatibilityScore: score,
        matchReasons: reasons
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return res.json({
    total: recommendations.length,
    recommendations
  });
});

export default router;
