import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const indianElectionPhotos = [
  // Voting queues & booths
  { url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80", caption: "Voters queue at polling booth, Rajasthan", tag: "booth" },
  { url: "https://images.unsplash.com/photo-1612355231439-5e83ce9de1e0?w=800&q=80", caption: "Ink-marked finger — the mark of democracy", tag: "ink" },
  { url: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80", caption: "Village women waiting to vote, Bihar", tag: "women" },
  { url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80", caption: "Massive voter turnout, general elections", tag: "crowd" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", caption: "Electronic voting machine (EVM)", tag: "booth" },
  // People voting
  { url: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&q=80", caption: "Rural voter casting ballot, Uttar Pradesh", tag: "women" },
  { url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80", caption: "Elderly man exercises his right to vote", tag: "men" },
  { url: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80", caption: "First-time voters at a city polling centre", tag: "booth" },
  { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80", caption: "Young voters in urban India", tag: "crowd" },
  { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80", caption: "Community gathering before election day", tag: "crowd" },
  // Village & rural
  { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80", caption: "Village polling booth in rural India", tag: "booth" },
  { url: "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?w=800&q=80", caption: "Women voters in traditional attire, Gujarat", tag: "women" },
  { url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80", caption: "Men discussing candidates before voting", tag: "men" },
  { url: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80", caption: "Polling officials preparing EVM machines", tag: "booth" },
  { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80", caption: "Long queues outside polling station", tag: "crowd" },
  // Celebrations & results
  { url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", caption: "Election results celebration", tag: "crowd" },
  { url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", caption: "Community leaders at vote counting centre", tag: "men" },
  { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80", caption: "Women empowerment through voting rights", tag: "women" },
  { url: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80", caption: "Democracy in motion — India votes", tag: "crowd" },
  { url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80", caption: "Election commission officials at work", tag: "booth" },
  // Ink finger close-ups & symbols
  { url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80", caption: "The indelible ink — symbol of participation", tag: "ink" },
  { url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80", caption: "Voter ID verification at polling booth", tag: "booth" },
  { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80", caption: "Proud voter displaying inked finger", tag: "ink" },
  { url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80", caption: "Senior citizens voting — experience matters", tag: "men" },
  { url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80", caption: "Young India — first-time voter celebrates", tag: "crowd" },
];

const tabs = [
  { id: 'all', label: 'All', icon: '🌍' },
  { id: 'booth', label: 'Booths', icon: '🗳️' },
  { id: 'women', label: 'Women', icon: '👩' },
  { id: 'men', label: 'Men', icon: '👨' },
  { id: 'crowd', label: 'Crowds', icon: '✊' },
  { id: 'ink', label: 'Ink', icon: '🖊️' },
];

export const PhotoGallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof indianElectionPhotos[0] | null>(null);

  const filtered = activeTab === 'all' 
    ? indianElectionPhotos 
    : indianElectionPhotos.filter(p => p.tag === activeTab);

  return (
    <section id="gallery" style={{ padding: '100px 0', background: '#05050A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Visual Journey
          </p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(40px, 5.5vw, 68px)', letterSpacing: '-1px', color: '#F0EEE4', marginBottom: '16px' }}>
            Democracy in Action
          </h2>
          <p style={{ color: '#6B7280', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            India — The World's Largest Democracy · 970 Million Voters
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '48px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                background: activeTab === tab.id ? 'rgba(212, 160, 23, 0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${activeTab === tab.id ? '#D4A017' : 'rgba(255,255,255,0.1)'}`,
                color: activeTab === tab.id ? '#D4A017' : '#6B7280',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.url}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-zoom-in group relative"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  loading="lazy"
                  style={{ width: '100%', display: 'block' }}
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              style={{ position: 'absolute', top: '30px', right: '30px', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ maxWidth: '90vw', maxHeight: '80vh', position: 'relative', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.caption}
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 20px 80px rgba(0,0,0,0.5)' }} 
              />
              <p style={{ color: 'white', marginTop: '20px', fontSize: '18px', fontFamily: 'Inter' }}>{selectedPhoto.caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoGallerySection;
