import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, FileCheck, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isFullAccess = user?.accessType === 'full';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#2F3134] shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-[#50D8FF]">Assessment Portal</div>
            <span className="text-gray-400 text-sm">Questionnaire Management System</span>
          </div>
          <div className="flex items-center space-x-4">
            {isFullAccess && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-white hover:text-[#50D8FF] transition-colors"
              >
                <Home size={20} />
                <span>Dashboard</span>
              </button>
            )}
            <button
              onClick={() => navigate('/questionnaire')}
              className="flex items-center space-x-2 text-white hover:text-[#50D8FF] transition-colors"
            >
              <FileText size={20} />
              <span>New Questionnaire</span>
            </button>
            {isFullAccess && (
              <button
                onClick={() => navigate('/submitted')}
                className="flex items-center space-x-2 text-white hover:text-[#50D8FF] transition-colors"
              >
                <FileCheck size={20} />
                <span>Submitted</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white hover:text-[#50D8FF] transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#1a1c1e] border-t border-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            Developed by Anas Raqi
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
