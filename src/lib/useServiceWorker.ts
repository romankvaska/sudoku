'use client';

import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    // Register service worker for offline support
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every 60 seconds

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('New Service Worker activated');
                  // Optionally notify user about update
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    } else if ('serviceWorker' in navigator && process.env.NODE_ENV === 'development') {
      // In development, unregister service workers to avoid caching issues
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        })
        .catch((error) => {
          console.error('Error unregistering Service Worker:', error);
        });
    }
  }, []);
}
