import React, { useState } from 'react';
import authService, { RegisterData } from '../services/auth';

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    companyName: '',
    kvkNumber: '',
    vatNumber: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      onSuccess();
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="kvkNumber" className="block text-sm font-medium text-gray-700">KVK Number</label>
        <input
          type="text"
          name="kvkNumber"
          id="kvkNumber"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={formData.kvkNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">VAT Number</label>
        <input
          type="text"
          name="vatNumber"
          id="vatNumber"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={formData.vatNumber}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;