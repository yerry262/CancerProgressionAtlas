import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { UserPlus, Dna, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterFormValues } from '../lib/validation';

const PERKS = [
  'Track all your submissions in one place',
  'Receive updates when your imaging is approved',
  'See your contribution impact over time',
  'Withdraw submissions anytime',
];

export default function Register() {
  const { register: authRegister, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const pw = watch('password', '');

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await authRegister(values.email, values.password, values.displayName);
      toast.success('Account created! Welcome to CancerProgressionAtlas.');
      navigate('/upload');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  const pwStrength = pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <Dna className="w-7 h-7" style={{ color: '#00d4ff' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#c8dff0' }}>Create your account</h1>
          <p className="text-sm mt-1" style={{ color: '#6a8fa8' }}>
            Already have one?{' '}
            <Link to="/login" style={{ color: '#00d4ff' }} className="hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Perks */}
          <div className="lg:col-span-2 space-y-3 pt-2">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#3d5a73' }}>With an account</p>
            {PERKS.map(p => (
              <div key={p} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00e676' }} />
                <p className="text-sm leading-snug" style={{ color: '#6a8fa8' }}>{p}</p>
              </div>
            ))}
            <div className="mt-4 p-3 rounded-xl text-xs leading-relaxed" style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.12)', color: '#3d5a73' }}>
              Anonymous uploads are always available — no account needed.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 p-6 rounded-2xl" style={{ background: 'rgba(13, 26, 46, 0.8)', border: '1px solid rgba(26, 58, 92, 0.8)' }}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
                  Display Name <span style={{ color: '#3d5a73' }}>(optional)</span>
                </label>
                <input
                  {...register('displayName')}
                  type="text"
                  placeholder="e.g. Sarah M. (used publicly only if you choose)"
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(16, 32, 56, 0.8)', border: '1px solid rgba(26, 58, 92, 0.8)', color: '#c8dff0' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
                  Email Address <span style={{ color: '#00d4ff' }}>*</span>
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
                  Password <span style={{ color: '#00d4ff' }}>*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 chars, 1 uppercase, 1 number"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm"
                    style={{ background: 'rgba(16, 32, 56, 0.8)', border: errors.password ? '1px solid rgba(255, 61, 90, 0.6)' : '1px solid rgba(26, 58, 92, 0.8)', color: '#c8dff0' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: '#3d5a73' }}>
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {pw && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(26, 58, 92, 0.5)' }}>
                      <div className="h-1 rounded-full transition-all" style={{ width: pwStrength ? '100%' : pw.length >= 4 ? '50%' : '20%', background: pwStrength ? '#00e676' : pw.length >= 4 ? '#ffab00' : '#ff3d5a' }} />
                    </div>
                    <span className="text-xs" style={{ color: pwStrength ? '#00e676' : '#6a8fa8' }}>
                      {pwStrength ? 'Strong' : 'Weak'}
                    </span>
                  </div>
                )}
                {errors.password && <p className="text-xs" style={{ color: '#ff3d5a' }}>{errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6a8fa8' }}>
                  Confirm Password <span style={{ color: '#00d4ff' }}>*</span>
                </label>
                <input
                  {...register('confirmPassword')}
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: 'rgba(16, 32, 56, 0.8)', border: errors.confirmPassword ? '1px solid rgba(255, 61, 90, 0.6)' : '1px solid rgba(26, 58, 92, 0.8)', color: '#c8dff0' }}
                />
                {errors.confirmPassword && <p className="text-xs" style={{ color: '#ff3d5a' }}>{errors.confirmPassword.message}</p>}
              </div>

              <p className="text-xs leading-relaxed" style={{ color: '#3d5a73' }}>
                By creating an account you agree to our{' '}
                <Link to="/privacy" style={{ color: '#6a8fa8' }} className="hover:underline">Privacy Policy</Link> and{' '}
                <Link to="/terms" style={{ color: '#6a8fa8' }} className="hover:underline">Terms of Use</Link>.
                Your email is never shared publicly.
              </p>

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
                {isLoading ? <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {isLoading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
