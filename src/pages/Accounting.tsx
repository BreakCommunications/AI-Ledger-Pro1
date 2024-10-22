import React from 'react';
import TransactionList from '../components/TransactionList';
import AddTransactionForm from '../components/AddTransactionForm';
import FinancialReportGenerator from '../components/FinancialReportGenerator';
import AIInsights from '../components/AIInsights';

const Accounting: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Accounting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <AddTransactionForm />
          <TransactionList />
        </div>
        <div>
          <FinancialReportGenerator />
          <AIInsights />
        </div>
      </div>
    </div>
  );
};

export default Accounting;