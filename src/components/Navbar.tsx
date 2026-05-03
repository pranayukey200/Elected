import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Menu, X } from 'lucide-react';

const navLinks = ['Timeline', 'Stats', 'Globe', 'FAQ', 'About'];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 32px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(10,10,15,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6, #ef4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(59,130,246,0.5)',
        }}>
          <Vote size={18} color="white" />
        </div>
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '22px',
          letterSpacing: '3px',
          background: 'linear-gradient(90deg, #60a5fa, #e1e0cc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          ElectED
        </span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => scrollTo(link)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(225,224,204,0.7)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.color = '#3b82f6';
              (e.target as HTMLButtonElement).style.background = 'rgba(59,130,246,0.08)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.color = 'rgba(225,224,204,0.7)';
              (e.target as HTMLButtonElement).style.background = 'none';
            }}
          >
            {link}
          </button>
        ))}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="btn-primary"
          style={{ padding: '8px 20px', fontSize: '13px', marginLeft: '8px' }}
          onClick={() => scrollTo('Timeline')}
        >
          Get Started
        </motion.button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
        id="mobile-menu-btn"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'absolute',
              top: '70px',
              left: 0,
              right: 0,
              background: 'rgba(10,10,15,0.98)',
              backdropFilter: 'blur(20px)',
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '12px 16px',
                  textAlign: 'left',
                  borderRadius: '8px',
                }}
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
