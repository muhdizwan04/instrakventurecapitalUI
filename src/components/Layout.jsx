import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePageContent } from '../hooks/usePageContent';
import SEO from './SEO';
import { Helmet } from 'react-helmet-async';

const Layout = ({ children }) => {
  const { content: settings } = usePageContent('global_settings');

  const themeStyles = settings?.themeColors ? `
    :root {
      --accent-primary: ${settings.themeColors.primary || '#1A365D'};
      --accent-secondary: ${settings.themeColors.secondary || '#B8860B'};
      --accent-tertiary: ${settings.themeColors.accent || '#0A74DA'};
    }
  ` : '';

  return (
    <div className="layout">
      <Helmet>
        <style>{themeStyles}</style>
      </Helmet>
      <SEO />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
