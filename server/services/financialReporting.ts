import { analyzeDocument } from './openai';
import Transaction from '../models/Transaction';

interface FinancialReportData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  topIncomeCategories: { category: string; amount: number }[];
  topExpenseCategories: { category: string; amount: number }[];
}

export const generateFinancialReport = async (userId: string, startDate: Date, endDate: Date): Promise<string> => {
  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lte: endDate }
  });

  const reportData: FinancialReportData = {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    topIncomeCategories: [],
    topExpenseCategories: []
  };

  const categoryTotals: { [key: string]: { income: number; expense: number } } = {};

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      reportData.totalIncome += transaction.amount;
    } else {
      reportData.totalExpenses += transaction.amount;
    }

    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = { income: 0, expense: 0 };
    }
    categoryTotals[transaction.category][transaction.type] += transaction.amount;
  });

  reportData.netProfit = reportData.totalIncome - reportData.totalExpenses;

  reportData.topIncomeCategories = Object.entries(categoryTotals)
    .map(([category, totals]) => ({ category, amount: totals.income }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  reportData.topExpenseCategories = Object.entries(categoryTotals)
    .map(([category, totals]) => ({ category, amount: totals.expense }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const prompt = `Generate a detailed financial report based on the following data:

${JSON.stringify(reportData, null, 2)}

Please provide a comprehensive analysis including:
1. Overview of total income, expenses, and net profit
2. Analysis of top income and expense categories
3. Trends and patterns in the financial data
4. Recommendations for improving financial performance
5. Any potential areas of concern or opportunities for growth

Please format the report in a clear and professional manner, suitable for presentation to stakeholders.`;

  return analyzeDocument(prompt);
};