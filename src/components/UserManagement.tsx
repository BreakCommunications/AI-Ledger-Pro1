import React, { useState, useEffect } from 'react';
import userService, { User } from '../services/userService';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers();
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">User Management</h2>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">{user.companyName}</p>
            </div>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;