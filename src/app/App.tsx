import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import { CustomCursor } from '../components/animations/CustomCursor';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

// Pages
import { Home } from '../pages/Home';
import { CVPage } from '../pages/CVPage';
import { SeedCVPage } from '../pages/SeedCVPage';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { Login } from '../pages/admin/Login';
import { Dashboard } from '../pages/admin/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// Main Layout Component
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

function AppContent() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
          {/* Public Routes with Layout */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          {/* CV Routes */}
          <Route path="/cv" element={<CVPage />} />
          <Route path="/seed-cv" element={<SeedCVPage />} />

          {/* Legal */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Admin Routes without main layout */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              color: theme === 'dark' ? '#f8fafc' : '#1e293b',
              border: theme === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#6366f1',
                secondary: theme === 'dark' ? '#f8fafc' : '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: theme === 'dark' ? '#f8fafc' : '#ffffff',
              },
            },
          }}
        />
    </BrowserRouter>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
