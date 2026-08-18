import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for offline support and auto updates
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] New version available, reloading...');
  },
  onOfflineReady() {
    console.log('[PWA] Workstation is cached and ready for offline use.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
