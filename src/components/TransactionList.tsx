import React, { useState, useEffect } from 'react';
import accountingService, { Transaction } from '../services/accountingService';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await accountingService.getTransactions();
        setTransactions(fetchedTransactions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found. Start by adding a new transaction.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                  {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;