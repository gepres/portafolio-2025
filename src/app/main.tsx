import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '../context/ThemeContext';

import '../index.css';
import '../i18n/config'; // Initialize i18n
import '../lib/firebase/seedHelper'; // CV seed helper for browser console

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
