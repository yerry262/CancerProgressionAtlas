import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Upload, Menu, X, Dna, LogIn, LogOut, User, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dataset', label: 'Dataset' },
  { to: '/about', label: 'Research' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(5, 10, 20, 0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(26, 58, 92, 0.7)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <Dna className="w-5 h-5" style={{ color: '#00d4ff' }} />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-widest uppercase" style={{ color: '#00d4ff', letterSpacing: '0.12em' }}>
              Cancer Progression Atlas
            </div>
            <div className="text-xs mono" style={{ color: '#3d5a73', letterSpacing: '0.08em' }}>
              Open Imaging Database
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}
              className="px-4 py-2 text-sm rounded-lg transition-all duration-200"
              style={{
                color: pathname === to ? '#00d4ff' : '#6a8fa8',
                background: pathname === to ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                border: pathname === to ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent',
              }}>
              {label}
            </Link>
          ))}

          <Link to="/upload"
            className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: 'rgba(0, 212, 255, 0.1)',
              color: '#00d4ff',
              border: '1px solid rgba(0, 212, 255, 0.25)',
            }}>
            <Upload className="w-4 h-4" />
            Upload
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative ml-2">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ border: '1px solid rgba(26, 58, 92, 0.6)', color: '#c8dff0', background: 'rgba(13, 26, 46, 0.5)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0, 212, 255, 0.15)', color: '#00d4ff' }}>
                  {(user?.displayName ?? user?.email ?? 'U')[0].toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user?.displayName ?? user?.email?.split('@')[0]}</span>
                <ChevronDown className="w-3 h-3" style={{ color: '#3d5a73' }} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50"
                  style={{ background: 'rgba(13, 26, 46, 0.98)', border: '1px solid rgba(26, 58, 92, 0.8)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                  <Link to="/submissions" onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-white/5"
                    style={{ color: '#c8dff0', borderBottom: '1px solid rgba(26, 58, 92, 0.4)' }}>
                    <User className="w-4 h-4" style={{ color: '#00d4ff' }} /> My Submissions
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-white/5"
                      style={{ color: '#ffab00', borderBottom: '1px solid rgba(26, 58, 92, 0.4)' }}>
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm transition-all hover:bg-white/5"
                    style={{ color: '#ff3d5a' }}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}>
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff', boxShadow: '0 0 16px rgba(0,102,255,0.3)' }}>
                Join Free
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg"
          style={{ color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}
          onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 pt-2 space-y-1"
          style={{ borderTop: '1px solid rgba(26, 58, 92, 0.5)', background: 'rgba(5, 10, 20, 0.98)' }}>
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm rounded-lg"
              style={{ color: pathname === to ? '#00d4ff' : '#6a8fa8', background: pathname === to ? 'rgba(0, 212, 255, 0.08)' : 'transparent' }}>
              {label}
            </Link>
          ))}
          <Link to="/upload" onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm rounded-lg font-semibold"
            style={{ color: '#00d4ff', background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            Upload Imaging
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/submissions" onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm rounded-lg" style={{ color: '#6a8fa8' }}>
                My Submissions
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm rounded-lg font-semibold"
                  style={{ color: '#ffab00', background: 'rgba(255,171,0,0.05)', border: '1px solid rgba(255,171,0,0.15)' }}>
                  <ShieldCheck className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <button onClick={() => { handleLogout(); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm rounded-lg" style={{ color: '#ff3d5a' }}>
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 rounded-xl text-sm font-medium"
                style={{ border: '1px solid rgba(26, 58, 92, 0.5)', color: '#6a8fa8' }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}>
                Join Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
