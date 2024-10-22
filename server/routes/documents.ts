import express from 'express';
import multer from 'multer';
import path from 'path';
import Document from '../models/Document';
import Transaction from '../models/Transaction';
import { authenticateToken } from '../middleware/auth';
import { analyzeDocument } from '../services/openai';
import { processDocument } from '../services/documentProcessing';
import { categorizeInvoice } from '../services/invoiceProcessing';

const router = express.Router();

// ... (previous code remains the same)

router.post('/upload-invoice', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const extractedText = await processDocument(filePath);
    const invoiceData = await categorizeInvoice(extractedText);

    const document = new Document({
      title: req.file.originalname,
      content: extractedText,
      category: 'Invoice',
      userId: req.user.userId,
      analysis: JSON.stringify(invoiceData)
    });

    await document.save();

    const transaction = new Transaction({
      date: invoiceData.date,
      description: invoiceData.description,
      amount: invoiceData.amount,
      category: invoiceData.category,
      type: invoiceData.type,
      userId: req.user.userId
    });

    await transaction.save();

    res.status(201).json({ document, transaction });
  } catch (error) {
    console.error('Error processing invoice:', error);
    res.status(500).json({ message: 'Error processing invoice' });
  }
});

// ... (rest of the routes remain the same)

export default router;