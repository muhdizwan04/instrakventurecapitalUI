import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, useIsRestoring } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css'
import './styles/EditorialPages.css'
import App from './App.jsx'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const HydrationWrapper = ({ children }) => {
  const isRestoring = useIsRestoring();
  // While restoring from localStorage, react-query pauses all queries so persisted
  // cache data loads first (avoids unnecessary network requests). The sync persister
  // makes this nearly instant (<50ms), so the blank flash is imperceptible.
  if (isRestoring) return null;
  return children;
};



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours — discard stale persisted cache
        buster: 'v2', // bump to invalidate old cache from fallback-only mode
      }}
    >
      <HelmetProvider>
        <HydrationWrapper>
          <BrowserRouter>
            <ThemeProvider>
            <LoadingProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </LoadingProvider>
            </ThemeProvider>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </HydrationWrapper>
      </HelmetProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
