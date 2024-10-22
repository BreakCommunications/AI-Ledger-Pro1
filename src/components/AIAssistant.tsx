import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/ai-assistant/ask', { question });
      setAnswer(response.data.answer);
    } catch (err) {
      setError('Failed to get AI assistance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">Ask a question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="How can I improve my cash flow?"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {answer && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-2">Answer:</h3>
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;