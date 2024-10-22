import express from 'express';
import User from '../models/User';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { companyName, kvkNumber, vatNumber } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, 
      { companyName, kvkNumber, vatNumber },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating user data' });
  }
});

router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(401).json({ message: 'Invalid current password' });
    }
    
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error changing password' });
  }
});

router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;