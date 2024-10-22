import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, DollarSign, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-between items-center">
          <li>
            <Link to="/" className="flex items-center text-xl font-bold text-gray-800">
              <Home className="mr-2" /> AI Ledger Pro
            </Link>
          </li>
          {user && (
            <li className="flex space-x-4">
              <Link to="/documents" className="flex items-center text-gray-600 hover:text-gray-800">
                <FileText className="mr-1" /> Documents
              </Link>
              <Link to="/accounting" className="flex items-center text-gray-600 hover:text-gray-800">
                <DollarSign className="mr-1" /> Accounting
              </Link>
              <Link to="/settings" className="flex items-center text-gray-600 hover:text-gray-800">
                <Settings className="mr-1" /> Settings
              </Link>
              <button onClick={logout} className="flex items-center text-gray-600 hover:text-gray-800">
                <LogOut className="mr-1" /> Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;