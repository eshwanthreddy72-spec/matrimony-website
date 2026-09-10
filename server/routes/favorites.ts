import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticate, AuthRequest } from '../auth.ts';

const router = Router();

// GET /api/favorites
router.get('/favorites', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const favs = db.getFavorites(currentUserId);
  const profiles = favs
    .map(f => {
      const profile = db.findProfileById(f.profileId);
      return profile ? { ...profile, favoritedAt: f.createdAt } : null;
    })
    .filter(Boolean);

  return res.json({
    total: profiles.length,
    profiles
  });
});

// POST /api/favorites/:profileId
router.post('/favorites/:profileId', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const targetProfile = db.findProfileById(req.params.profileId);
  if (!targetProfile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const fav = db.addFavorite(currentUserId, targetProfile._id);
  return res.status(201).json({ message: 'Profile saved to favorites!', favorite: fav });
});

// DELETE /api/favorites/:profileId
router.delete('/favorites/:profileId', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const success = db.removeFavorite(currentUserId, req.params.profileId);
  if (!success) {
    return res.status(404).json({ error: 'Favorite not found.' });
  }
  return res.json({ message: 'Profile removed from favorites.' });
});

export default router;
