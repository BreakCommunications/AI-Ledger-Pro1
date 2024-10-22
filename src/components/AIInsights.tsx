import React, { useState, useEffect } from 'react';
import accountingService from '../services/accountingService';

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const fetchedInsights = await accountingService.getAIInsights();
        setInsights(fetchedInsights);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch AI insights');
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <div>Loading AI insights...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">AI-Powered Insights</h2>
      <p className="text-gray-700 whitespace-pre-line">{insights}</p>
    </div>
  );
};

export default AIInsights;