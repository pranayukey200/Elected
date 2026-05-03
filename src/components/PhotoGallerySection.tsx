import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const TABS = ['Voting Day', 'The People', 'Global Democracy'] as const;
type Tab = typeof TABS[number];

const IMAGES: Record<Tab, { url: string; alt: string; caption: string; location: string }[]> = {
  'Voting Day': [
    {
      url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
      alt: 'Voting booth in India',
      caption: 'Casting the ballot',
      location: 'New Delhi, 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
      alt: 'Ballot box',
      caption: 'Securing the vote',
      location: 'Mumbai, 2024',
    },
  ],
  'The People': [
    {
      url: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=800&q=80',
      alt: 'Indian voters waiting in queue',
      caption: 'The queue of democracy',
      location: 'Kolkata, 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1612355231439-5e83ce9de1e0?auto=format&fit=crop&w=800&q=80',
      alt: 'Finger with election ink in India',
      caption: 'The mark of participation',
      location: 'Bangalore, 2024',
    },
  ],
  'Global Democracy': [
    {
      url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80',
      alt: 'Crowd at a democracy rally',
      caption: 'Voices united',
      location: 'Chennai, 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
      alt: 'Crowd in India',
      caption: 'The power of the collective',
      location: 'Hyderabad, 2024',
    },
  ],
};

const PhotoGallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Voting Day');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} style={{ background: '#05050A', padding: '100px 0', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 64px)', color: '#F0EEE4', marginBottom: '16px', lineHeight: 1.1 }}>
            Democracy in Action — <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#D4A017' }}>India</span>'s Electoral Journey
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', fontSize: '18px' }}>
            The world's largest democracy — 970 million voters, one extraordinary process
          </p>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'rgba(37,99,235,0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab ? '#2563EB' : 'rgba(255,255,255,0.08)'}`,
                color: activeTab === tab ? '#F0EEE4' : '#6B7280',
                padding: '10px 24px',
                borderRadius: '100px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab === 'Voting Day' && '🗳️ '}
              {tab === 'The People' && '✊ '}
              {tab === 'Global Democracy' && '🌍 '}
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry Gallery */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '60px'
            }}
          >
            {IMAGES[activeTab].map((img, idx) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: idx % 2 === 0 ? '4/5' : '1/1',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget.firstChild as HTMLElement).style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(212,160,23,0.15)';
                  e.currentTarget.style.border = '1px solid rgba(212,160,23,0.3)';
                  (e.currentTarget.lastChild as HTMLElement).style.opacity = '1';
                  (e.currentTarget.lastChild as HTMLElement).style.transform = 'translateY(0)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget.firstChild as HTMLElement).style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.border = 'none';
                  (e.currentTarget.lastChild as HTMLElement).style.opacity = '0';
                  (e.currentTarget.lastChild as HTMLElement).style.transform = 'translateY(20px)';
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '32px 24px 24px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <p style={{ fontFamily: 'Inter, sans-serif', color: '#F0EEE4', fontWeight: 600, fontSize: '18px', margin: '0 0 4px 0' }}>{img.caption}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', color: '#D4A017', fontSize: '14px', margin: 0 }}>{img.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Stat Bar */}
        <div
          style={{
            border: '1px solid rgba(212,160,23,0.3)',
            borderRadius: '16px',
            background: 'rgba(212,160,23,0.05)',
            padding: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            gap: '24px',
            textAlign: 'center'
          }}
        >
          {['969M Voters', '1M Polling Stations', '543 Constituencies', '60% Average Turnout'].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '24px', color: '#D4A017' }}>{stat.split(' ')[0]}</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#F0EEE4', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PhotoGallerySection;
