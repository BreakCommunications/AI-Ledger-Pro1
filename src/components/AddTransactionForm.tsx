import React, { useState } from 'react';
import accountingService from '../services/accountingService';

const AddTransactionForm: React.FC = () => {
  const [transaction, setTransaction] = useState({
    date: '',
    description: '',
    amount: '',
    category: '',
    type: 'expense'
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await accountingService.addTransaction({
        ...transaction,
        amount: parseFloat(transaction.amount),
        type: transaction.type as 'income' | 'expense'
      });
      // Reset form or show success message
      setTransaction({ date: '', description: '', amount: '', category: '', type: 'expense' });
    } catch (err) {
      setError('Failed to add transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={transaction.date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={transaction.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          name="amount"
          id="amount"
          required
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={transaction.amount}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={transaction.category}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          id="type"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={transaction.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransactionForm;