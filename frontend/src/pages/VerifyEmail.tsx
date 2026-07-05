import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../services/auth.service';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified! You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: unknown) {
        setStatus('error');
        const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
          ?? 'Email verification failed. Please try again or request a new link.';
        setMessage(message);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
      <div className="max-w-lg w-full text-center">
        <div className="p-12 rounded-3xl"
          style={{ background: 'rgba(13,26,46,0.8)', border: '1px solid rgba(26,58,92,0.5)' }}>

          {status === 'loading' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin"
                style={{ background: 'rgba(0,212,255,0.1)', border: '2px solid rgba(0,212,255,0.2)' }}>
                <Loader2 className="w-10 h-10" style={{ color: '#00d4ff' }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Verifying Email</h2>
              <p style={{ color: '#6a8fa8' }}>Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(0,230,118,0.1)', border: '2px solid rgba(0,230,118,0.4)' }}>
                <CheckCircle className="w-10 h-10" style={{ color: '#00e676' }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Email Verified!</h2>
              <p className="text-sm mb-4" style={{ color: '#6a8fa8' }}>
                {message}
              </p>
              <p className="text-xs mono" style={{ color: '#3d5a73' }}>
                Redirecting to login...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(255,107,107,0.1)', border: '2px solid rgba(255,107,107,0.3)' }}>
                <AlertCircle className="w-10 h-10" style={{ color: '#ff6b6b' }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Verification Failed</h2>
              <p className="text-sm mb-6" style={{ color: '#6a8fa8' }}>
                {message}
              </p>
              <div className="space-y-3">
                <button onClick={() => navigate('/register')}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}>
                  Back to Register
                </button>
                <button onClick={() => navigate('/login')}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ border: '1px solid rgba(26,58,92,0.5)', color: '#c8dff0' }}>
                  Go to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
