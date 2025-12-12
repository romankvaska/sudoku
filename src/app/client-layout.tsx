'use client';

import { useServiceWorker } from '@/lib/useServiceWorker';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useServiceWorker();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('To install this app, use your browser\'s "Add to Home Screen" or "Install" option in the menu.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Sudoku</h1>
          <div className="space-x-4 flex items-center">
            {!isInstalled && (
              <button
                onClick={handleInstall}
                className="text-green-300 hover:text-green-100 text-sm font-medium transition-colors cursor-pointer bg-transparent border-none"
              >
                Install App
              </button>
            )}
            <a href="/" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              Play
            </a>
            <a href="/history" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              History
            </a>
            <a href="/tournaments" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              Tournaments
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Sudoku PWA © 2025 | Play offline, track your progress</p>
        </div>
      </footer>
    </div>
  );
}
