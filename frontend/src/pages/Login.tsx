import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { LogIn, Dna, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginFormValues } from '../lib/validation';

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
      navigate('/submissions');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Login failed. Please check your credentials.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <Dna className="w-7 h-7" style={{ color: '#00d4ff' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#c8dff0' }}>Sign in to your account</h1>
          <p className="text-sm mt-1" style={{ color: '#6a8fa8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#00d4ff' }} className="hover:underline">Create one free</Link>
          </p>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: 'rgba(13, 26, 46, 0.8)', border: '1px solid rgba(26, 58, 92, 0.8)' }}>
          {/* Anonymous note */}
          <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(0, 212, 255, 0.06)', border: '1px solid rgba(0, 212, 255, 0.15)' }}>
            <p style={{ color: '#6a8fa8' }}>
              <span style={{ color: '#c8dff0' }}>No account needed to contribute.</span> You can upload imaging
              anonymously without signing in — an account just lets you track your submissions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(16, 32, 56, 0.8)', border: errors.email ? '1px solid rgba(255, 61, 90, 0.6)' : '1px solid rgba(26, 58, 92, 0.8)', color: '#c8dff0' }}
              />
              {errors.email && <p className="text-xs" style={{ color: '#ff3d5a' }}>{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm"
                  style={{ background: 'rgba(16, 32, 56, 0.8)', border: errors.password ? '1px solid rgba(255, 61, 90, 0.6)' : '1px solid rgba(26, 58, 92, 0.8)', color: '#c8dff0' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: '#3d5a73' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs" style={{ color: '#ff3d5a' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: isLoading ? 'rgba(26, 58, 92, 0.5)' : 'linear-gradient(135deg, #0066ff, #00d4ff)',
                color: isLoading ? '#3d5a73' : '#fff',
                boxShadow: isLoading ? 'none' : '0 0 20px rgba(0, 102, 255, 0.3)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/upload" className="text-sm hover:underline" style={{ color: '#6a8fa8' }}>
              Continue as anonymous contributor →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
