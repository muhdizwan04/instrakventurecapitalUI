import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePageContent } from '../hooks/usePageContent';

const Layout = ({ children }) => {
  const { content: settings } = usePageContent('global_settings');

  useEffect(() => {
    if (settings?.themeColors) {
      const root = document.documentElement;
      if (settings.themeColors.primary) {
        root.style.setProperty('--accent-primary', settings.themeColors.primary);
      }
      if (settings.themeColors.secondary) {
        root.style.setProperty('--accent-secondary', settings.themeColors.secondary);
      }
      if (settings.themeColors.accent) {
        root.style.setProperty('--accent-tertiary', settings.themeColors.accent);
      }
    }

    // Update document title and favicon if available
    if (settings?.siteIdentity) {
      if (settings.siteIdentity.siteName) {
        document.title = settings.siteIdentity.siteName;
      }
      if (settings.siteIdentity.faviconUrl) {
        const link = document.querySelector("link[rel~='icon']");
        if (link) {
          link.href = settings.siteIdentity.faviconUrl;
        }
      }
    }
  }, [settings]);

  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
