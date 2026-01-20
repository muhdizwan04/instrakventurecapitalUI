import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import MissionVisionValues from './pages/MissionVisionValues';
import BoardOfDirectors from './pages/BoardOfDirectors';
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
const MainLayout = () => (
  <Layout>
    <ScrollToTop />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/mission-vision-values" element={<MissionVisionValues />} />
        <Route path="/board-of-directors" element={<BoardOfDirectors />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/latest-news-2" element={<LatestNews />} />
        <Route path="/contact" element={<Contact />} />
        {/* Service Detail Pages */}
        <Route path="/services/virtual-cfo" element={<BusinessFinanceConsulting />} />
        <Route path="/services/business-finance-consulting" element={<BusinessFinanceConsulting />} />
        <Route path="/services/business-finance-consulting" element={<BusinessFinanceConsulting />} />
        <Route path="/services/equity-financing" element={<EquityFinancing />} />
        <Route path="/services/real-estate-financing" element={<RealEstateFinancing />} />
        <Route path="/services/reits" element={<REITs />} />
        <Route path="/services/share-financing" element={<ShareFinancing />} />
        <Route path="/services/merger-acquisition" element={<MergerAcquisition />} />
        <Route path="/services/tokenization" element={<Tokenization />} />
        <Route path="/services/asset-insurance" element={<AssetInsurance />} />
        <Route path="/services/ppli" element={<PPLI />} />
        <Route path="/services/gig" element={<GlobalInvestmentGateway />} />
        <Route path="/services/private-wealth" element={<PrivateWealthInvestment />} />
        <Route path="/services/aum" element={<AssetUnderManagement />} />
        <Route path="/project-listings" element={<ProjectListing />} />
        <Route path="/strategic-partners" element={<StrategicPartners />} />
      </Routes>
    </Suspense>
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <EmailVerificationListener />
      <Routes>
        {/* Auth routes - outside Layout (cleaner login/register pages) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* All other routes - with Layout */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
