import React, { useState } from 'react';
import accountingService, { FinancialReport } from '../services/accountingService';

const FinancialReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<'annual' | 'quarterly' | 'monthly'>('monthly');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedReport = await accountingService.generateFinancialReport(reportType);
      setReport(generatedReport);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Generate Financial Report</h2>
      <div>
        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
        <select
          id="reportType"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={reportType}
          onChange={(e) => setReportType(e.target.value as 'annual' | 'quarterly' | 'monthly')}
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
        </select>
      </div>
      <button
        onClick={generateReport}
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {report && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Financial Report</h3>
          <p>Period: {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</p>
          <p>Total Income: €{report.totalIncome.toFixed(2)}</p>
          <p>Total Expenses: €{report.totalExpenses.toFixed(2)}</p>
          <p className="font-bold">Net Profit: €{report.netProfit.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialReportGenerator;