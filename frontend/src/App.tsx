import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dataset from './pages/Dataset';
import Submissions from './pages/Submissions';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center">
      <div className="text-center">
        <p className="text-7xl font-black mono mb-4" style={{ color: 'rgba(0, 212, 255, 0.2)' }}>404</p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Page not found</h1>
        <p className="text-sm mb-6" style={{ color: '#6a8fa8' }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}
