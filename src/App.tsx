import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import DocumentManagement from './pages/DocumentManagement';
import Accounting from './pages/Accounting';
import Settings from './pages/Settings';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginForm onSuccess={() => {}} />} />
              <Route path="/register" element={<RegisterForm onSuccess={() => {}} />} />
              <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/documents" element={<PrivateRoute element={<DocumentManagement />} />} />
              <Route path="/accounting" element={<PrivateRoute element={<Accounting />} />} />
              <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;