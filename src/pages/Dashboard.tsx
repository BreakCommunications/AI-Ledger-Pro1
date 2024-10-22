import React from 'react';
import AIAssistant from '../components/AIAssistant';
import InvoiceUpload from '../components/InvoiceUpload';
import FinancialSummary from '../components/FinancialSummary';
import TaxInfo from '../components/TaxInfo';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <FinancialSummary />
          <div className="mt-8">
            <InvoiceUpload />
          </div>
        </div>
        <div>
          <AIAssistant />
          <div className="mt-8">
            <TaxInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;