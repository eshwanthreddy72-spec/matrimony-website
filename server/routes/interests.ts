import { Router, Response } from 'express';
import { db } from '../db.ts';
import { authenticate, AuthRequest } from '../auth.ts';

const router = Router();

// GET /api/interests - get all sent and received interests for current user
router.get('/interests', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const { sent, received } = db.getUserInterests(currentUserId);

  // Enrich with profile information
  const enrich = (list: typeof sent) => {
    return list.map(item => {
      const senderProfile = db.findProfileByUserId(item.fromUserId);
      const receiverProfile = db.findProfileByUserId(item.toUserId);
      return {
        ...item,
        senderProfile,
        receiverProfile
      };
    });
  };

  return res.json({
    sent: enrich(sent),
    received: enrich(received)
  });
});

// POST /api/interests - send an interest
router.post('/interests', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const userProfile = db.findProfileByUserId(currentUserId);
  if (!userProfile) {
    return res.status(400).json({ error: 'Please create your profile before sending interests.' });
  }

  const { targetProfileId, message } = req.body;
  if (!targetProfileId) {
    return res.status(400).json({ error: 'Target profile ID is required.' });
  }

  const targetProfile = db.findProfileById(targetProfileId);
  if (!targetProfile) {
    return res.status(404).json({ error: 'Target profile not found.' });
  }

  if (targetProfile.userId === currentUserId) {
    return res.status(400).json({ error: 'You cannot express interest in your own profile.' });
  }

  const interest = db.createInterest({
    fromUserId: currentUserId,
    fromProfileId: userProfile._id,
    toUserId: targetProfile.userId,
    toProfileId: targetProfile._id,
    status: 'pending',
    message: message || `Hello, I reviewed your profile on the Matrimony platform and would be delighted to connect.`
  });

  return res.status(201).json({
    message: 'Interest sent successfully!',
    interest: {
      ...interest,
      senderProfile: userProfile,
      receiverProfile: targetProfile
    }
  });
});

// PUT /api/interests/:id - accept or reject or cancel
router.put('/interests/:id', authenticate, (req: AuthRequest, res: Response) => {
  const { action } = req.body; // 'accept' | 'reject' | 'cancel'
  const currentUserId = req.user!._id;
  const interest = db.getInterests().find(i => i._id === req.params.id);

  if (!interest) {
    return res.status(404).json({ error: 'Interest request not found.' });
  }

  if (action === 'cancel') {
    if (interest.fromUserId !== currentUserId) {
      return res.status(403).json({ error: 'You can only cancel interests sent by you.' });
    }
    db.deleteInterest(interest._id);
    return res.json({ message: 'Interest cancelled successfully.' });
  }

  if (action === 'accept' || action === 'reject') {
    if (interest.toUserId !== currentUserId) {
      return res.status(403).json({ error: 'You can only accept or reject interests received by you.' });
    }
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    const updated = db.updateInterestStatus(interest._id, newStatus);
    return res.json({
      message: `Interest ${action === 'accept' ? 'accepted' : 'declined'} successfully.`,
      interest: updated
    });
  }

  return res.status(400).json({ error: 'Invalid action. Must be accept, reject, or cancel.' });
});

// DELETE /api/interests/:id
router.delete('/interests/:id', authenticate, (req: AuthRequest, res: Response) => {
  const currentUserId = req.user!._id;
  const interest = db.getInterests().find(i => i._id === req.params.id);
  if (!interest) {
    return res.status(404).json({ error: 'Interest not found.' });
  }

  if (interest.fromUserId !== currentUserId && interest.toUserId !== currentUserId) {
    return res.status(403).json({ error: 'Unauthorized to delete this interest.' });
  }

  db.deleteInterest(interest._id);
  return res.json({ message: 'Interest removed.' });
});

export default router;
