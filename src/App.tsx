/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import PublicPage from './components/PublicPage';
import AdminPanel from './components/AdminPanel';
import { THEMES } from './lib/theme';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Eye, Settings, ShieldAlert, Sparkles, X } from 'lucide-react';

function AppContent() {
  const { isAdminLoggedIn, currentTheme, notifications, activeTenant } = useApp();
  const theme = THEMES[currentTheme];

  // Real-time toast state for new notification arrivals
  const [activeToast, setActiveToast] = useState<{ id: string; title: string; message: string } | null>(null);
  
  // Dynamic admin-only public page preview toggle state
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Sync preview mode with admin session state
  useEffect(() => {
    if (!isAdminLoggedIn) {
      setIsPreviewMode(false);
    }
  }, [isAdminLoggedIn]);

  // Monitor notifications array to trigger beautiful in-app floating popups on any new arrivals
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // Only show if it was created in the last 15 seconds
      const isNew = Date.now() - new Date(latest.date).getTime() < 15000;
      if (isNew) {
        setActiveToast({
          id: latest.id,
          title: latest.title,
          message: latest.message
        });

        // Auto dismiss after 5 seconds
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  return (
    <div className={`${theme.bg} min-h-screen transition-colors duration-300 relative`}>
      
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Router */}
      <main className="relative z-10 pb-16">
        {isAdminLoggedIn && !isPreviewMode ? (
          <div>
            {/* Admin Control Dashboard */}
            <AdminPanel />
          </div>
        ) : (
          /* Public Web App Landing & Booking Catalogs */
          <div>
            {isAdminLoggedIn && isPreviewMode && (
              <div className="bg-gradient-to-r from-amber-500 to-[#D48166] text-black text-xs font-bold py-3 text-center border-b border-amber-500/20 flex items-center justify-center space-x-4 shadow-lg sticky top-16 z-30">
                <span className="font-extrabold uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="animate-ping inline-block w-2 h-2 rounded-full bg-red-600 mr-1" />
                  <span>👀 Vista Previa Pública Activa de {activeTenant.name}</span>
                </span>
                <button
                  onClick={() => setIsPreviewMode(false)}
                  className="bg-stone-900 text-white hover:bg-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition shadow-md active:scale-95 cursor-pointer flex items-center space-x-1 border border-stone-800"
                >
                  <span>🛑 Cerrar Vista Pública (Volver al Panel)</span>
                </button>
              </div>
            )}
            <PublicPage />
          </div>
        )}
      </main>

      {/* Floating Mode Toggle for Admins to quickly inspect public changes */}
      {isAdminLoggedIn && !isPreviewMode && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center space-x-2 bg-stone-900 text-white hover:bg-stone-950 px-5 py-3 rounded-full shadow-2xl border border-stone-800 font-extrabold text-xs uppercase tracking-wide cursor-pointer transition hover:scale-105 active:scale-95"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Previsualizar Web</span>
          </button>
        </div>
      )}

      {/* Real-Time Floating Notification Toast Center */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-stone-950 text-white rounded-2xl border border-cyan-500/40 p-4 shadow-2xl flex items-start space-x-3"
          >
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-grow">
              <h4 className="text-xs font-bold text-cyan-400 font-mono">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-stone-300 leading-relaxed mt-1">
                {activeToast.message}
              </p>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-stone-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Footer Branding */}
      <footer className="absolute bottom-0 left-0 right-0 h-10 border-t border-stone-200/40 dark:border-zinc-900/60 flex items-center justify-center text-[10px] font-mono text-stone-400 tracking-wider">
        <span>© 2026 PWA Fitness Multi-Inquilino • Licencia Válida</span>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
