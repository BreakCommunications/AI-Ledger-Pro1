import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/openai-settings');
      setApiKey(response.data.apiKey);
      setModel(response.data.model);
    } catch (err) {
      setError('Failed to fetch OpenAI settings');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/openai-settings', { apiKey, model });
      setLoading(false);
    } catch (err) {
      setError('Failed to update OpenAI settings');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">OpenAI Integration Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="gpt-4o">GPT-4o (High-intelligence flagship model)</option>
            <option value="gpt-4o-mini">GPT-4o mini (Affordable, intelligent small model)</option>
            <option value="o1-preview">o1-preview (Complex reasoning model)</option>
            <option value="o1-mini">o1-mini (Lightweight complex reasoning model)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;