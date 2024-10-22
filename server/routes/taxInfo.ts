import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { scrapeTaxRates } from '../services/taxScraper';
import { calculateIncomeTax, calculateVAT } from '../services/taxCalculation';
import logger from '../utils/logger';

const router = express.Router();

router.get('/rates', authenticateToken, async (req, res) => {
  try {
    const rates = await scrapeTaxRates();
    res.json(rates);
  } catch (error) {
    logger.error('Error fetching tax rates:', error);
    res.status(500).json({ message: 'Error fetching tax rates' });
  }
});

router.post('/calculate-income-tax', authenticateToken, async (req, res) => {
  try {
    const { income } = req.body;
    const rates = await scrapeTaxRates();
    const tax = calculateIncomeTax(income, rates.incomeTax);
    res.json({ tax });
  } catch (error) {
    logger.error('Error calculating income tax:', error);
    res.status(500).json({ message: 'Error calculating income tax' });
  }
});

router.post('/calculate-vat', authenticateToken, async (req, res) => {
  try {
    const { amount, rateType } = req.body;
    const rates = await scrapeTaxRates();
    const rate = rateType === 'standard' ? rates.vatRates.standard : rates.vatRates.reduced;
    const vat = calculateVAT(amount, rate);
    res.json({ vat });
  } catch (error) {
    logger.error('Error calculating VAT:', error);
    res.status(500).json({ message: 'Error calculating VAT' });
  }
});

export default router;