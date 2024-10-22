import axios from 'axios';

const API_URL = 'http://localhost:3000/api/accounting';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface FinancialReport {
  id: string;
  type: 'annual' | 'quarterly' | 'monthly';
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

const accountingService = {
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await axios.get(`${API_URL}/transactions`);
    return response.data;
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const response = await axios.post(`${API_URL}/transactions`, transaction);
    return response.data;
  },

  generateFinancialReport: async (type: 'annual' | 'quarterly' | 'monthly'): Promise<FinancialReport> => {
    const response = await axios.post(`${API_URL}/reports`, { type });
    return response.data;
  },

  getTaxCalculation: async (year: number): Promise<any> => {
    const response = await axios.get(`${API_URL}/tax-calculation/${year}`);
    return response.data;
  },

  getAIInsights: async (): Promise<string> => {
    const response = await axios.get(`${API_URL}/ai-insights`);
    return response.data.insights;
  }
};

export default accountingService;