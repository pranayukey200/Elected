import React, { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import './index.css';

// ── Eager (above-the-fold) ────────────────────────────────────────────────────
import ParticleField from './components/ParticleField';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import { MagneticCursor } from './components/MagneticCursor';

// ── Lazy (below-the-fold) ─────────────────────────────────────────────────────
const ElectionTimeline = lazy(() => import('./components/ElectionTimeline'));
const StatsSection = lazy(() => import('./components/StatsSection'));
const GlobeSection = lazy(() => import('./components/GlobeSection'));
const PhotoGallerySection = lazy(() => import('./components/PhotoGallerySection'));
const FAQSection = lazy(() =>
  import('./components/Footer').then((mod) => ({ default: mod.FAQSection }))
);
const Footer = lazy(() => import('./components/Footer'));
const ChatPanel = lazy(() => import('./components/ChatPanel'));

// ── Section loading placeholder ───────────────────────────────────────────────
const SectionFallback: React.FC = () => (
  <div
    aria-hidden="true"
    style={{
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid rgba(59,130,246,0.2)',
        borderTopColor: '#3b82f6',
        animation: 'spin-slow 0.8s linear infinite',
      }}
    />
  </div>
);

const App: React.FC = () => {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* Skip-to-content for keyboard / screen reader users */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          top: '-100px',
          left: '16px',
          zIndex: 9999,
          background: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          textDecoration: 'none',
          transition: 'top 0.2s ease',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '16px'; }}
        onBlur={(e) => { e.currentTarget.style.top = '-100px'; }}
      >
        Skip to main content
      </a>

      <div
        style={{
          position: 'relative',
          background: 'var(--bg-primary)',
          minHeight: '100vh',
        }}
      >
        {/* Background constellation particles */}
        <ParticleField />

        {/* Global radial accent glows */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(ellipse 50% 40% at 15% 10%, rgba(59,130,246,0.06) 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 85% 90%, rgba(239,68,68,0.05) 0%, transparent 60%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── Scrollable page content ───────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <header role="banner">
            <Navbar />
          </header>

          <main id="main-content" role="main" tabIndex={-1} style={{ outline: 'none' }}>
            <HeroSection />

            <Suspense fallback={<SectionFallback />}>
              <ElectionTimeline />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <StatsSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <GlobeSection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <PhotoGallerySection />
            </Suspense>

            <Suspense fallback={<SectionFallback />}>
              <FAQSection />
            </Suspense>
          </main>

          <footer role="contentinfo">
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </footer>
        </div>

        {/* ── Floating AI Chat (outside main for z-index stacking) ─────────── */}
        <Suspense fallback={null}>
          <ChatPanel />
        </Suspense>
        
        <MagneticCursor />
      </div>
    </LazyMotion>
  );
};

export default App;
