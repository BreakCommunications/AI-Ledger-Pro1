import React from 'react';
import UserProfile from '../components/UserProfile';
import ChangePasswordForm from '../components/ChangePasswordForm';
import UserManagement from '../components/UserManagement';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <UserProfile />
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <ChangePasswordForm />
          </div>
        </div>
        {user?.role === 'admin' && (
          <div>
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;