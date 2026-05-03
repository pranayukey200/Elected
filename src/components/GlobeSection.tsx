import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ParticleGlobe } from './ParticleGlobe';

gsap.registerPlugin(ScrollTrigger);

const EARTH_VIDEO = "https://cdn.mixkit.co/videos/preview/mixkit-earth-rotating-in-space-23786-large.mp4";

const GlobeSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('section h2').forEach((heading: any) => {
        gsap.fromTo(heading, 
          { y: 60, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          {
            scrollTrigger: { trigger: heading, start: 'top 90%', toggleActions: 'play none none none', once: true },
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'expo.out',
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section id="globe" ref={ref} style={{ padding: '100px 0', position: 'relative', background: '#05050A' }}>
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
        src={EARTH_VIDEO}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Global Democracy
          </p>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              letterSpacing: '-1px',
              lineHeight: 1,
              color: '#F0EEE4',
              marginBottom: '16px',
            }}
          >
            Democracy Across the World
          </h2>
          <p
            style={{
              color: '#6B7280',
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Explore the scale of democratic participation globally.
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%', height: '600px', borderRadius: '24px', overflow: 'hidden' }}>
          <ParticleGlobe />
        </div>
      </div>
    </section>
  );
};

export default GlobeSection;
