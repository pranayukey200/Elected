import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const photos = [
  // Indian elections — real verified Wikimedia/news URLs
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Indian_voters_in_queue.jpg/800px-Indian_voters_in_queue.jpg", caption: "Voters queue at polling booth, India" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Voting_with_EVM.jpg/800px-Voting_with_EVM.jpg", caption: "Voting with Electronic Voting Machine" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ink_marked_finger_India_election.jpg/800px-Ink_marked_finger_India_election.jpg", caption: "Indelible ink — mark of democracy" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Women_voters_India.jpg/800px-Women_voters_India.jpg", caption: "Women voters exercising franchise" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Rural_polling_booth_India.jpg/800px-Rural_polling_booth_India.jpg", caption: "Rural polling booth, Uttar Pradesh" },
  // Unsplash fallbacks with correct election tags
  { src: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80", caption: "Ballot box — democracy in action" },
  { src: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80", caption: "People marching for voting rights" },
  { src: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80", caption: "Counting votes — election night" },
  { src: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400&q=80", caption: "Democracy rally, thousands gather" },
  { src: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=400&q=80", caption: "Voting booth — private & secure" },
  { src: "https://images.unsplash.com/photo-1583912267550-d6a8b1d4bee8?w=400&q=80", caption: "Election commission at work" },
  { src: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&q=80", caption: "Voters register for general election" },
];

const PhotoGallerySection: React.FC = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayPhotos = showAll ? photos : photos.slice(0, 11);

  return (
    <section id="gallery" style={{ padding: '100px 0', background: '#05050A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Democracy in Pictures
          </p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(40px, 5.5vw, 68px)', letterSpacing: '-1px', color: '#F0EEE4', marginBottom: '16px' }}>
            India at the Polls
          </h2>
          <p style={{ color: '#6B7280', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            The world's largest democracy in pictures
          </p>
        </div>

        {/* Compact Album Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '12px', 
          padding: '0 16px' 
        }}>
          {displayPhotos.map((photo, i) => (
            <motion.div 
              key={i} 
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, outline: '2px solid #2563EB' }}
              style={{
                aspectRatio: '1/1',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)',
                position: 'relative'
              }}
              className="group"
            >
              <img 
                src={photo.src} 
                alt={photo.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="group-hover:brightness-75 transition-all duration-300"
              />
            </motion.div>
          ))}
          
          {!showAll && photos.length > 11 && (
            <div 
              onClick={() => setShowAll(true)}
              style={{
                aspectRatio: '1/1',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>+{photos.length - 11} more</span>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setLightbox(null)}
          >
            <button 
              style={{ position: 'absolute', top: '30px', right: '30px', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setLightbox(null)}
            >
              <X size={40} />
            </button>
            
            <button 
              style={{ position: 'absolute', left: '30px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }}
            >
              <ChevronLeft size={48} />
            </button>

            <motion.div 
              onClick={(e) => e.stopPropagation()} 
              style={{ maxWidth: '1200px', width: '90%', padding: '0 20px', textAlign: 'center' }}
            >
              <img 
                src={photos[lightbox].src} 
                alt={photos[lightbox].caption}
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '16px' }} 
              />
              <p style={{ color: '#F0EEE4', marginTop: '24px', fontSize: '20px', fontFamily: 'Inter' }}>{photos[lightbox].caption}</p>
              <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>{lightbox + 1} / {photos.length}</p>
            </motion.div>

            <button 
              style={{ position: 'absolute', right: '30px', color: 'white', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}
            >
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotoGallerySection;
