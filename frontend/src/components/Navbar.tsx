import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, Menu, X, Dna } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dataset', label: 'Dataset' },
  { to: '/upload', label: 'Upload Imaging' },
  { to: '/submissions', label: 'My Submissions' },
  { to: '/about', label: 'Research' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(5, 10, 20, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(26, 58, 92, 0.7)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
            <Dna className="w-5 h-5" style={{ color: '#00d4ff' }} />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0, 212, 255, 0.05)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-widest uppercase" style={{ color: '#00d4ff', letterSpacing: '0.15em' }}>
              CancerProgressionAtlas
            </div>
            <div className="text-xs mono" style={{ color: '#3d5a73', letterSpacing: '0.1em' }}>
              Open Source Imaging Database
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 text-sm rounded-lg transition-all duration-200 relative"
              style={{
                color: pathname === to ? '#00d4ff' : '#6a8fa8',
                background: pathname === to ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                border: pathname === to ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/upload"
            className="ml-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
              color: '#fff',
              boxShadow: '0 0 20px rgba(0, 102, 255, 0.3)',
            }}
          >
            <Upload className="w-4 h-4" />
            Contribute
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(26, 58, 92, 0.5)' }}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm rounded-lg"
              style={{
                color: pathname === to ? '#00d4ff' : '#6a8fa8',
                background: pathname === to ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
