import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

const FinancialSummary: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get('/api/accounting/summary');
        setFinancialData(response.data);
      } catch (err) {
        setError('Failed to fetch financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading) return <div>Loading financial summary...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!financialData) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-lg font-semibold text-green-600">€{financialData.totalIncome.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-lg font-semibold text-red-600">€{financialData.totalExpenses.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className={`text-lg font-semibold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            €{financialData.netProfit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;