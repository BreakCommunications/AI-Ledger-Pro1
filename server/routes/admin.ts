import express from 'express';
import { isAdmin } from '../middleware/auth';
import OpenAISettingsModel from '../models/OpenAISettings';

const router = express.Router();

router.get('/openai-settings', isAdmin, async (req, res) => {
  try {
    const settings = await OpenAISettingsModel.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching OpenAI settings' });
  }
});

router.post('/openai-settings', isAdmin, async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    await OpenAISettingsModel.updateSettings({ apiKey, model });
    res.json({ message: 'OpenAI settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating OpenAI settings' });
  }
});

export default router;