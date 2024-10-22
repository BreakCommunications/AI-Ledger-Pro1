import Transaction from '../models/Transaction';
import Document from '../models/Document';
import { generateAIInsights } from './openai';

export const generateFinancialReport = async (userId: string, type: 'annual' | 'quarterly' | 'monthly') => {
  const currentDate = new Date();
  let startDate: Date;

  switch (type) {
    case 'annual':
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      break;
    case 'quarterly':
      startDate = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
      break;
    case 'monthly':
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      break;
  }

  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lte: currentDate }
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return {
    type,
    startDate,
    endDate: currentDate,
    totalIncome,
    totalExpenses,
    netProfit
  };
};

export const getAIInsights = async (userId: string) => {
  const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(100);
  const documents = await Document.find({ userId }).sort({ createdAt: -1 }).limit(20);

  return generateAIInsights(transactions, documents);
};