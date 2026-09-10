import { Router, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db.ts';
import { authenticate, AuthRequest } from '../auth.ts';
import { MediaPhoto } from '../types.ts';

const router = Router();

// GET /api/media - current user's media
router.get('/media', authenticate, (req: AuthRequest, res: Response) => {
  const profile = db.findProfileByUserId(req.user!._id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  return res.json({
    total: profile.photos.length,
    photos: profile.photos,
    profilePhoto: profile.profilePhoto
  });
});

// POST /api/media/upload
router.post('/media/upload', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const profile = db.findProfileByUserId(req.user!._id);
    if (!profile) {
      return res.status(404).json({ error: 'Please create a profile before uploading photos.' });
    }

    const { url, base64Data, caption, isProfilePhoto } = req.body;
    let photoUrl = url;

    if (!photoUrl && base64Data) {
      // In production Cloudinary handles upload; in our full-stack service we store the secure URI
      photoUrl = base64Data.startsWith('data:') ? base64Data : `data:image/jpeg;base64,${base64Data}`;
    }

    if (!photoUrl) {
      return res.status(400).json({ error: 'Photo data or image URL is required.' });
    }

    const newPhotoId = `photo-${crypto.randomUUID().slice(0, 8)}`;
    const isFirstPhoto = profile.photos.length === 0;

    const newPhoto: MediaPhoto = {
      id: newPhotoId,
      url: photoUrl,
      caption: caption || '',
      status: 'pending', // Undergoes admin moderation as specified in PRD!
      uploadedAt: new Date().toISOString(),
      isProfilePhoto: Boolean(isProfilePhoto || isFirstPhoto)
    };

    profile.photos.push(newPhoto);

    // If marked as profile photo, update profilePhoto field
    if (isProfilePhoto || isFirstPhoto || !profile.profilePhoto) {
      profile.profilePhoto = photoUrl;
    }

    db.calculateCompletion(profile);
    db.updateProfile(profile._id, {
      photos: profile.photos,
      profilePhoto: profile.profilePhoto,
      profileCompletion: profile.profileCompletion
    });

    return res.status(201).json({
      message: 'Photo uploaded successfully! It has been submitted for verification.',
      photo: newPhoto,
      profile
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error uploading photo.' });
  }
});

// PUT /api/media/:id/primary - set as profile photo
router.put('/media/:id/primary', authenticate, (req: AuthRequest, res: Response) => {
  const profile = db.findProfileByUserId(req.user!._id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const targetPhoto = profile.photos.find(p => p.id === req.params.id);
  if (!targetPhoto) {
    return res.status(404).json({ error: 'Photo not found in your gallery.' });
  }

  profile.photos.forEach(p => {
    p.isProfilePhoto = p.id === targetPhoto.id;
  });
  profile.profilePhoto = targetPhoto.url;

  db.updateProfile(profile._id, {
    photos: profile.photos,
    profilePhoto: profile.profilePhoto
  });

  return res.json({
    message: 'Profile photo updated successfully!',
    profilePhoto: profile.profilePhoto,
    photos: profile.photos
  });
});

// DELETE /api/media/:id - delete photo
router.delete('/media/:id', authenticate, (req: AuthRequest, res: Response) => {
  const profile = db.findProfileByUserId(req.user!._id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const success = db.deletePhoto(profile._id, req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Photo not found.' });
  }

  const updatedProfile = db.findProfileById(profile._id);
  return res.json({
    message: 'Photo deleted successfully.',
    photos: updatedProfile?.photos || [],
    profilePhoto: updatedProfile?.profilePhoto || ''
  });
});

export default router;
