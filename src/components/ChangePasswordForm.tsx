import React, { useState } from 'react';
import userService from '../services/userService';

const ChangePasswordForm: React.FC = () => {
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      await userService.changePassword(passwords.oldPassword, passwords.newPassword);
      setSuccess(true);
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
        <input
          type="password"
          name="oldPassword"
          id="oldPassword"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={passwords.oldPassword}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={passwords.newPassword}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          value={passwords.confirmPassword}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Password changed successfully</p>}
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Change Password
      </button>
    </form>
  );
};

export default ChangePasswordForm;