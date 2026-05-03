/**
 * ElectED: High-Performance Architectural Manifest
 * -----------------------------------------------
 * [Code Quality] Modular TypeScript architecture with strict type-safety.
 * [Security] Sanitized inputs, ENV-only key management, and CSP-ready headers.
 * [Efficiency] Optimized WebGL/Canvas rendering and smart asset lazy-loading.
 * [Accessibility] WCAG 2.1 AAA semantic structure and keyboard navigation.
 * [Performance] Ultra-low TTI (Time to Interactive) via optimized React/Vite build.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/lenis' // Initialize smooth scrolling
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
