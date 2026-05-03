import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Shield } from 'lucide-react';
import { ReadinessQuiz } from './ReadinessQuiz';
import { CrosshairParticles } from './CrosshairParticles';
import { HeroPullUp } from './HeroPullUp';

const HERO_VIDEO = "https://cdn.mixkit.co/videos/preview/mixkit-dark-background-with-particles-1189-large.mp4";

const HeroSection: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const scrollToTimeline = () => {
    document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '70px',
      }}
    >
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.2,
          mixBlendMode: 'luminosity',
          zIndex: 0
        }}
        src={HERO_VIDEO}
      />

      {/* Animated gradient mesh background */}
      <div className="hero-bg" style={{ zIndex: 0 }} />

      <CrosshairParticles />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '900px',
          padding: '0 24px',
        }}
      >
        {/* Floating badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[
            { icon: <Zap size={12} />, text: '2026 Elections', color: '#3b82f6' },
            { icon: <Shield size={12} />, text: 'Verified Info', color: '#ef4444' },
          ].map(({ icon, text, color }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                border: `1px solid ${color}60`,
                background: `${color}15`,
                color: color,
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.5px',
                boxShadow: `0 0 20px ${color}30`,
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              {icon}
              {text}
            </motion.div>
          ))}
        </div>

        {/* Main heading with GSAP/Framer text reveal */}
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(54px, 10vw, 110px)',
              lineHeight: 1,
              letterSpacing: '-1px',
              color: '#F0EEE4'
            }}
          >
            <HeroPullUp text="Understand Your Vote" gold="Vote" />
          </h1>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 44px',
          }}
        >
          A step-by-step guide to how elections work —{' '}
          <span style={{ color: '#F0EEE4', fontWeight: 500 }}>
            from registration to results
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToTimeline}
            style={{
              padding: '16px 40px',
              fontSize: '15px',
              boxShadow: '0 8px 40px rgba(37,99,235,0.4)',
              background: '#2563EB',
              color: '#F0EEE4',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              borderRadius: '8px'
            }}
          >
            Start Learning
          </motion.button>
          <motion.button
            className="btn-outline"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsQuizOpen(true)}
            style={{ 
              padding: '16px 40px', 
              fontSize: '15px', 
              borderColor: '#10b981', 
              color: '#10b981', 
              background: 'rgba(16,185,129,0.1)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              borderRadius: '8px'
            }}
          >
            Check Your Readiness →
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{
            marginTop: '64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: '#6B7280',
            fontSize: '11px',
            letterSpacing: '2px',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isQuizOpen && <ReadinessQuiz onClose={() => setIsQuizOpen(false)} />}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
