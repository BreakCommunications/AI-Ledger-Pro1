import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { generateFinancialReport } from '../services/financialReporting';

const router = express.Router();

// ... (previous routes remain the same)

router.post('/generate-report', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const report = await generateFinancialReport(req.user.userId, new Date(startDate), new Date(endDate));
    res.json({ report });
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ message: 'Error generating financial report' });
  }
});

export default router;