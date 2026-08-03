import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Removed `error` from useAuth destructuring
  const { login, register, loginWithGoogle, loading } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null); // Local error state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const from = (location.state as any)?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError(null); // Clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (isRegister) {
        if (!formData.fullName.trim()) {
          toast.error('Please enter your full name');
          return;
        }
        await register(formData.email, formData.password, formData.fullName);
        toast.success('Account created successfully!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Authentication failed';
      setAuthError(msg);
      toast.error(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Google sign-in failed';
      setAuthError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            {isRegister 
              ? 'Join ShopSphere to manage orders and checkout seamlessly' 
              : 'Please enter your credentials to log in'}
          </p>
        </div>

        {/* Local Error Banner */}
        {authError && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
            {authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-600">Full Name</label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required={isRegister}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border p-2.5 pl-10 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600">Email Address</label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border p-2.5 pl-10 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Password</label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border p-2.5 pl-10 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:bg-slate-300 transition"
          >
            {loading 
              ? 'Processing...' 
              : isRegister 
                ? 'Sign Up' 
                : 'Sign In'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 border-t border-slate-200" />
          <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">Or</span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
        >
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setAuthError(null);
            }}
            className="font-bold text-blue-600 hover:underline"
          >
            {isRegister ? 'Log In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
}