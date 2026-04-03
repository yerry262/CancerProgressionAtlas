import { Link } from 'react-router-dom';
import { Dna, GitFork, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(26, 58, 92, 0.5)', background: 'rgba(5, 10, 20, 0.8)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>
                <Dna className="w-5 h-5" style={{ color: '#00d4ff' }} />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase" style={{ color: '#00d4ff' }}>
                CancerProgressionAtlas
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6a8fa8' }}>
              An open-source, crowdsourced medical imaging database built by cancer patients,
              for the future of AI-powered early detection. All data is anonymized and contributed
              with patient consent.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#3d5a73' }}>
              <Heart className="w-3 h-3" style={{ color: '#ff3d5a' }} />
              <span>Built with love for everyone fighting cancer</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3d5a73' }}>
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/dataset', label: 'Browse Dataset' },
                { to: '/upload', label: 'Upload Imaging' },
                { to: '/submissions', label: 'My Submissions' },
                { to: '/about', label: 'Research Goals' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-[#00d4ff] transition-colors" style={{ color: '#6a8fa8' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3d5a73' }}>
              Legal & Privacy
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Use' },
                { to: '/consent', label: 'Data Consent Info' },
                { to: '/license', label: 'Dataset License' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm hover:text-[#00d4ff] transition-colors" style={{ color: '#6a8fa8' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: '1px solid rgba(26, 58, 92, 0.3)' }}>
          <p className="text-xs mono" style={{ color: '#3d5a73' }}>
            © 2025 CancerProgressionAtlas. Open Source under CC BY 4.0 & MIT.
          </p>
          <a
            href="https://github.com/yerry262/cancerprogressionatlas"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all"
            style={{ color: '#6a8fa8', border: '1px solid rgba(26, 58, 92, 0.5)' }}
          >
            <GitFork className="w-4 h-4" />
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
