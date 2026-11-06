import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Purge any stale legacy caches from older versions immediately
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== 'monitor-clima-v5-network-first') {
        caches.delete(key);
      }
    });
  }).catch(() => {});
}

// 2. Register service worker with background push support and force update
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then((reg) => {
      reg.update().catch(() => {});
    })
    .catch((err) => {
      console.warn('SW register note:', err);
    });
}

createRoot(document.getElementById('root')!).render(<App />);
