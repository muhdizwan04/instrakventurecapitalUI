import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HomeManager from './pages/HomeManager';
import AboutManager from './pages/AboutManager';
import ServicesManager from './pages/ServicesManager';
import ServiceContentManager from './pages/ServiceContentManager';
import CareerManager from './pages/CareerManager';
import NewsManager from './pages/NewsManager';
import InquiriesManager from './pages/InquiriesManager';
import BoardManager from './pages/BoardManager';
import PartnersManager from './pages/PartnersManager';
import FooterManager from './pages/FooterManager';
import GlobalSettingsManager from './pages/GlobalSettingsManager';
import NavigationManager from './pages/NavigationManager';
import InvestorsManager from './pages/InvestorsManager';
import { Loader2 } from 'lucide-react';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
        <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="home" element={<HomeManager />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="board" element={<BoardManager />} />
        <Route path="partners" element={<PartnersManager />} />
        <Route path="services" element={<ServicesManager />} />
        <Route path="service-pages" element={<ServiceContentManager />} />
        <Route path="career" element={<CareerManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="footer" element={<FooterManager />} />
        <Route path="inquiries" element={<InquiriesManager />} />
        <Route path="global-settings" element={<GlobalSettingsManager />} />
        <Route path="navigation" element={<NavigationManager />} />
        <Route path="investors" element={<InvestorsManager />} />
        <Route path="*" element={<div className="p-8">Page Under Construction</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

