import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, companyName, kvkNumber, vatNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password, companyName, kvkNumber, vatNumber });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    const sessionToken = user.generateSessionToken();
    await user.save();

    res.status(201).json({ token, sessionToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    const sessionToken = user.generateSessionToken();
    await user.save();

    res.json({ token, sessionToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: 'Login failed' });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      user.sessionToken = undefined;
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Logout failed' });
  }
});

export default router;