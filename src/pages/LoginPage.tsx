import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { Shield, Users } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessType, setAccessType] = useState<'full' | 'assessment'>('full');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Set username based on access type selection
      const loginUsername = accessType === 'full' ? 'client' : 'assessment';
      
      const response = await loginService({ username: loginUsername, password });
      if (response.success && response.token) {
        login(response.token, response.accessType || accessType, response.username || loginUsername);
        
        // Navigate based on access type
        if (accessType === 'assessment') {
          navigate('/questionnaire');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2F3134] to-[#1a1c1e]">
      <div className="bg-[#3B3F42] p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-[#50D8FF] mb-2">Assessment Portal</div>
          <p className="text-gray-400">Questionnaire Management System</p>
        </div>

        {/* Access Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">Access Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccessType('full')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-md border-2 transition-all ${
                accessType === 'full'
                  ? 'border-[#50D8FF] bg-[#50D8FF] bg-opacity-20 text-white'
                  : 'border-gray-600 bg-[#2F3134] text-gray-400 hover:border-gray-500'
              }`}
            >
              <Shield size={18} />
              <span className="font-medium">Full Access</span>
            </button>
            <button
              type="button"
              onClick={() => setAccessType('assessment')}
              className={`flex items-center justify-center space-x-2 p-3 rounded-md border-2 transition-all ${
                accessType === 'assessment'
                  ? 'border-[#50D8FF] bg-[#50D8FF] bg-opacity-20 text-white'
                  : 'border-gray-600 bg-[#2F3134] text-gray-400 hover:border-gray-500'
              }`}
            >
              <Users size={18} />
              <span className="font-medium">Assessment</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            {accessType === 'full' 
              ? 'Full access to all features and management' 
              : 'Submit questionnaires only'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2F3134] border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#50D8FF] focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 text-red-200 px-4 py-3 rounded-md text-sm border border-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#50D8FF] hover:bg-[#3AB8E6] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-xs text-gray-400">
          Developed by Anas Raqi
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
