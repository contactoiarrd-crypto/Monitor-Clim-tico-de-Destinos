import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline functionality and PWA installation
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('PWA: Actualización disponible.');
  },
  onOfflineReady() {
    console.log('PWA: Aplicación lista para funcionar sin conexión.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
