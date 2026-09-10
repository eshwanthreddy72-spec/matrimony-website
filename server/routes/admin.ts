import { Router, Response } from 'express';
import { db } from '../db.ts';
import { requireAdmin, AuthRequest } from '../auth.ts';

const router = Router();

// All routes require admin privileges
router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', (_req: AuthRequest, res: Response) => {
  const users = db.getUsers().filter(u => u.role === 'user');
  const profiles = db.getProfiles();
  const allMedia = db.getAllMedia();
  const interests = db.getInterests();

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const verifiedProfiles = profiles.filter(p => p.isVerified).length;
  const totalUploads = allMedia.length;
  const pendingPhotoApprovals = allMedia.filter(m => m.photo.status === 'pending').length;
  const approvedPhotos = allMedia.filter(m => m.photo.status === 'approved').length;
  const rejectedPhotos = allMedia.filter(m => m.photo.status === 'rejected').length;

  const totalInterestsSent = interests.length;
  const acceptedInterests = interests.filter(i => i.status === 'accepted').length;

  // Daily registrations (grouped by date)
  const registrationsByDate: { [date: string]: number } = {};
  users.forEach(u => {
    const d = u.createdAt ? u.createdAt.slice(0, 10) : '2025-01-01';
    registrationsByDate[d] = (registrationsByDate[d] || 0) + 1;
  });

  return res.json({
    totalUsers,
    activeUsers,
    suspendedUsers,
    verifiedProfiles,
    verificationRate: totalUsers > 0 ? Math.round((verifiedProfiles / totalUsers) * 100) : 0,
    totalUploads,
    pendingApprovals: pendingPhotoApprovals,
    approvedPhotos,
    rejectedPhotos,
    totalInterestsSent,
    acceptedInterests,
    registrationsByDate
  });
});

// GET /api/admin/users - list users with profiles
router.get('/users', (_req: AuthRequest, res: Response) => {
  const users = db.getUsers().filter(u => u.role === 'user');
  const enriched = users.map(user => {
    const profile = db.findProfileByUserId(user._id);
    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      profile
    };
  });

  return res.json({ users: enriched });
});

// PUT /api/admin/users/:id/status - suspend / activate user
router.put('/users/:id/status', (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  if (status !== 'active' && status !== 'suspended') {
    return res.status(400).json({ error: 'Status must be active or suspended' });
  }

  const updated = db.updateUser(req.params.id, { status });
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    message: `User account is now ${status}.`,
    user: {
      _id: updated._id,
      username: updated.username,
      email: updated.email,
      status: updated.status
    }
  });
});

// PUT /api/admin/profiles/:id/verify - toggle verification
router.put('/profiles/:id/verify', (req: AuthRequest, res: Response) => {
  const { isVerified } = req.body;
  const profile = db.findProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  const updated = db.updateProfile(profile._id, {
    isVerified: typeof isVerified === 'boolean' ? isVerified : !profile.isVerified
  });

  return res.json({
    message: `Profile verification status updated to ${updated?.isVerified ? 'Verified' : 'Unverified'}.`,
    profile: updated
  });
});

// GET /api/admin/media - all uploaded photos for moderation
router.get('/media', (_req: AuthRequest, res: Response) => {
  const allMedia = db.getAllMedia();
  return res.json({ media: allMedia });
});

// PUT /api/admin/media/:photoId/status - approve or reject photo
router.put('/media/:photoId/status', (req: AuthRequest, res: Response) => {
  const { status, reason } = req.body;
  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }

  const updated = db.updatePhotoStatus(req.params.photoId, status, reason);
  if (!updated) {
    return res.status(404).json({ error: 'Media photo not found' });
  }

  return res.json({
    message: `Photo marked as ${status}.`,
    photo: updated
  });
});

// DELETE /api/admin/media/:profileId/:photoId - remove inappropriate media
router.delete('/media/:profileId/:photoId', (req: AuthRequest, res: Response) => {
  const success = db.deletePhoto(req.params.profileId, req.params.photoId);
  if (!success) {
    return res.status(404).json({ error: 'Photo or profile not found' });
  }
  return res.json({ message: 'Media content removed successfully.' });
});

export default router;
