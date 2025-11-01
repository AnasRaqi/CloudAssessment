import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginService({ username, password });
      if (response.success && response.token) {
        login(response.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2F3134] to-[#1a1c1e]">
      <div className="bg-[#3B3F42] p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-[#50D8FF] mb-2">ALPHACLOUD</div>
          <p className="text-gray-400">Cloud Assessment Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#2F3134] border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#50D8FF] focus:border-transparent"
              required
            />
          </div>

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
          © 2025 AlphaCloud | Confidential - For Naqel Use Only
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
