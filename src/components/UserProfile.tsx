import React, { useState, useEffect } from 'react';
import userService, { User } from '../services/userService';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">User Profile</h2>
      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Company Name:</strong> {user.companyName}</p>
        <p><strong>KVK Number:</strong> {user.kvkNumber}</p>
        <p><strong>VAT Number:</strong> {user.vatNumber}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;