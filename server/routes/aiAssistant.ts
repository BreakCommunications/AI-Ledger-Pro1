import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getAIAssistance } from '../services/aiAssistant';
import Document from '../models/Document';
import Transaction from '../models/Transaction';

const router = express.Router();

router.post('/ask', authenticateToken, async (req, res) => {
  try {
    const { question } = req.body;
    
    // Fetch recent documents and transactions for context
    const recentDocuments = await Document.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(5);
    const recentTransactions = await Transaction.find({ userId: req.user.userId }).sort({ date: -1 }).limit(10);

    const context = `
Recent Documents:
${recentDocuments.map(doc => `- ${doc.title}: ${doc.category}`).join('\n')}

Recent Transactions:
${recentTransactions.map(trans => `- ${trans.date.toISOString().split('T')[0]}: ${trans.description} (${trans.type}) - $${trans.amount}`).join('\n')}
`;

    const answer = await getAIAssistance(question, context);
    res.json({ answer });
  } catch (error) {
    console.error('Error getting AI assistance:', error);
    res.status(500).json({ message: 'Error getting AI assistance' });
  }
});

export default router;