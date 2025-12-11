'use client';

import { useServiceWorker } from '@/lib/useServiceWorker';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useServiceWorker();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Sudoku</h1>
          <div className="space-x-4 flex items-center">
            <a href="/" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              Play
            </a>
            <a href="/history" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              History
            </a>
            <a href="/tournaments" className="text-blue-100 hover:text-white text-sm font-medium transition-colors">
              Tournaments
            </a>
            {showInstallPrompt && (
              <button
                onClick={handleInstall}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Download
              </button>
            )}
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
