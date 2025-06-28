import React, { useState } from 'react';
import { DatabaseService } from '../lib/supabase';
import { User, Lock, Mail } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        result = await DatabaseService.signUp(email, password);
      } else {
        result = await DatabaseService.signIn(email, password);
      }

      if (result.error) {
        setError(result.error.message);
      } else if (result.data.user) {
        onAuthSuccess(result.data.user);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ios-gray-50 flex items-center justify-center px-4">
      <div className="ios-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ios-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-ios-blue" />
          </div>
          <h1 className="text-2xl font-bold text-ios-gray-900 mb-2">
            Personal Organizer
          </h1>
          <p className="text-ios-gray-600">
            {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ios-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ios-input"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ios-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ios-input"
              placeholder="Enter your password"
              required
              disabled={loading}
              minLength={6}
            />
            {isSignUp && (
              <p className="mt-1 text-xs text-ios-gray-500">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-ios-red bg-opacity-10 border border-ios-red border-opacity-20 rounded-ios">
              <p className="text-sm text-ios-red">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full ios-button disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-ios-blue hover:underline"
              disabled={loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>

        {/* Demo Note */}
        <div className="mt-8 p-4 bg-ios-gray-100 rounded-ios">
          <p className="text-xs text-ios-gray-600 text-center">
            <strong>Demo Mode:</strong> This app requires a Supabase backend to be configured. 
            Please set up your Supabase project and add the environment variables to use authentication.
          </p>
        </div>
      </div>
    </div>
  );
};
