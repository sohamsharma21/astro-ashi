
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Google Fonts - Noto Sans for better Hindi rendering
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);

createRoot(document.getElementById("root")!).render(<App />);
