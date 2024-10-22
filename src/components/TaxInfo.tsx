import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TaxRates {
  incomeTax: {
    brackets: { min: number; max: number; rate: number }[];
  };
  vatRates: {
    standard: number;
    reduced: number;
  };
}

const TaxInfo: React.FC = () => {
  const [taxRates, setTaxRates] = useState<TaxRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxRates = async () => {
      try {
        const response = await axios.get('/api/tax-info/rates');
        setTaxRates(response.data);
      } catch (err) {
        setError('Failed to fetch tax rates');
      } finally {
        setLoading(false);
      }
    };

    fetchTaxRates();
  }, []);

  if (loading) return <div>Loading tax information...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!taxRates) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Current Tax Rates</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Income Tax Brackets</h3>
          <ul className="list-disc list-inside">
            {taxRates.incomeTax.brackets.map((bracket, index) => (
              <li key={index}>
                €{bracket.min.toLocaleString()} - {bracket.max === Infinity ? '∞' : `€${bracket.max.toLocaleString()}`}: {bracket.rate}%
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium">VAT Rates</h3>
          <ul className="list-disc list-inside">
            <li>Standard rate: {taxRates.vatRates.standard}%</li>
            <li>Reduced rate: {taxRates.vatRates.reduced}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaxInfo;