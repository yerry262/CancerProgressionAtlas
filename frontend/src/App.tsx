import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dataset from './pages/Dataset';
import Submissions from './pages/Submissions';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Consent from './pages/Consent';
import License from './pages/License';
import Admin from './pages/Admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(13, 26, 46, 0.95)',
                color: '#c8dff0',
                border: '1px solid rgba(26, 58, 92, 0.8)',
                backdropFilter: 'blur(16px)',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#00e676', secondary: '#050a14' },
              },
              error: {
                iconTheme: { primary: '#ff3d5a', secondary: '#050a14' },
              },
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/dataset" element={<Dataset />} />
                <Route path="/submissions" element={<Submissions />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/consent" element={<Consent />} />
                <Route path="/license" element={<License />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center">
      <div className="text-center">
        <p className="text-7xl font-black mono mb-4" style={{ color: 'rgba(0, 212, 255, 0.2)' }}>404</p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#c8dff0' }}>Page not found</h1>
        <p className="text-sm mb-6" style={{ color: '#6a8fa8' }}>The page you're looking for doesn't exist.</p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#fff' }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}
