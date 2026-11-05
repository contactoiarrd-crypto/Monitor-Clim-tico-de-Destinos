import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// Safe service worker registration (handles both dev and prod environments)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      registerSW({
        immediate: true,
        onNeedRefresh() {
          console.log('PWA: Actualización disponible.');
        },
        onOfflineReady() {
          console.log('PWA: Aplicación lista para funcionar sin conexión.');
        },
      });
    })
    .catch(() => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

createRoot(document.getElementById('root')!).render(<App />);
