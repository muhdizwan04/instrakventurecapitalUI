import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import { useContentPrefetch } from './hooks/usePageContent';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ServicesPage from './pages/Services';
import Investors from './pages/Investors';
import JoinUs from './pages/JoinUs';
import LatestNews from './pages/LatestNews';
import Contact from './pages/Contact';
import StrategicPartners from './pages/StrategicPartners';
import ProjectListing from './pages/ProjectListing';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailVerificationListener from './components/EmailVerificationListener';

// Lazy load service detail pages for better performance
const BusinessFinanceConsulting = lazy(() => import('./pages/BusinessFinanceConsulting'));

const EquityFinancing = lazy(() => import('./pages/EquityFinancing'));
const RealEstateFinancing = lazy(() => import('./pages/RealEstateFinancing'));
const REITs = lazy(() => import('./pages/REITs'));
const ShareFinancing = lazy(() => import('./pages/ShareFinancing'));
const MergerAcquisition = lazy(() => import('./pages/MergerAcquisition'));
const Tokenization = lazy(() => import('./pages/Tokenization'));
const AssetInsurance = lazy(() => import('./pages/AssetInsurance'));
const PPLI = lazy(() => import('./pages/PPLI'));
const GlobalInvestmentGateway = lazy(() => import('./pages/GlobalInvestmentGateway'));
const PrivateWealthInvestment = lazy(() => import('./pages/PrivateWealthInvestment'));
const AssetUnderManagement = lazy(() => import('./pages/AssetUnderManagement'));

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #1A365D', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Main content with Layout
const MainLayout = () => {
  const location = useLocation();
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
            <Route path="/mission-vision-values" element={<Navigate to="/about#mission" replace />} />
            <Route path="/board-of-directors" element={<Navigate to="/about#board" replace />} />
            <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
            <Route path="/investors" element={<PageTransition><Investors /></PageTransition>} />
            <Route path="/join-us" element={<PageTransition><JoinUs /></PageTransition>} />
            <Route path="/latest-news-2" element={<PageTransition><LatestNews /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            {/* Service Detail Pages */}
            <Route path="/services/virtual-cfo" element={<PageTransition><BusinessFinanceConsulting /></PageTransition>} />
            <Route path="/services/business-finance-consulting" element={<PageTransition><BusinessFinanceConsulting /></PageTransition>} />
            <Route path="/services/equity-financing" element={<PageTransition><EquityFinancing /></PageTransition>} />
            <Route path="/services/real-estate-financing" element={<PageTransition><RealEstateFinancing /></PageTransition>} />
            <Route path="/services/reits" element={<PageTransition><REITs /></PageTransition>} />
            <Route path="/services/share-financing" element={<PageTransition><ShareFinancing /></PageTransition>} />
            <Route path="/services/merger-acquisition" element={<PageTransition><MergerAcquisition /></PageTransition>} />
            <Route path="/services/tokenization" element={<PageTransition><Tokenization /></PageTransition>} />
            <Route path="/services/asset-insurance" element={<PageTransition><AssetInsurance /></PageTransition>} />
            <Route path="/services/ppli" element={<PageTransition><PPLI /></PageTransition>} />
            <Route path="/services/gig" element={<PageTransition><GlobalInvestmentGateway /></PageTransition>} />
            <Route path="/services/private-wealth" element={<PageTransition><PrivateWealthInvestment /></PageTransition>} />
            <Route path="/services/aum" element={<PageTransition><AssetUnderManagement /></PageTransition>} />
            <Route path="/project-listings" element={<PageTransition><ProjectListing /></PageTransition>} />
            <Route path="/strategic-partners" element={<PageTransition><StrategicPartners /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};

function App() {
  // Fetch ALL site_content rows in one query and seed react-query cache
  useContentPrefetch();

  return (
    <>
      <EmailVerificationListener />
      <Routes>
        {/* Auth routes - outside Layout (cleaner login/register pages) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* All other routes - with Layout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </>
  );
}

export default App;
