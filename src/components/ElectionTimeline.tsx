import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: '01', icon: '📋', title: 'Voter Registration', desc: 'Citizens sign up to participate. Deadlines vary by region — check your local rules.' },
  { num: '02', icon: '🏅', title: 'Candidate Nomination', desc: 'Parties and independents formally declare their candidacy through official channels.' },
  { num: '03', icon: '📢', title: 'Campaigning Period', desc: 'Candidates campaign across media, debates, and rallies to win voter support.' },
  { num: '04', icon: '✉️', title: 'Early & Absentee Voting', desc: 'Voters unable to attend on Election Day can vote early or by mail in many jurisdictions.' },
  { num: '05', icon: '🗳️', title: 'Election Day', desc: 'Polls open and millions cast their votes at polling stations across the country.' },
  { num: '06', icon: '🧮', title: 'Vote Counting', desc: 'Ballots are tabulated by officials and independently verified for accuracy.' },
  { num: '07', icon: '✅', title: 'Results Certification', desc: 'Election authorities certify the results, making them official and legally binding.' },
  { num: '08', icon: '🎖️', title: 'Inauguration', desc: 'The elected official is sworn into office, completing the democratic process.' },
];

const ElectionTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!trackRef.current || !containerRef.current) return;

      const track = trackRef.current;
      const getScrollAmount = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          markers: false, // Explicitly false
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="timeline" 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        height: '100vh', 
        overflow: 'hidden', 
        background: '#05050A',
        whiteSpace: 'nowrap'
      }}
    >
      <div style={{ position: 'absolute', top: '10vh', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
          Scroll to explore
        </p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F0EEE4', fontFamily: 'Syne, sans-serif', margin: 0 }}>
          The Election <em style={{ fontFamily: 'Playfair Display, serif', color: '#D4A017', fontStyle: 'italic' }}>Journey</em>
        </h2>
      </div>
      
      <div 
        ref={trackRef} 
        style={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
          width: 'max-content',
          gap: '24px',
          padding: '0 15vw',
          height: '100%',
          willChange: 'transform',
        }}
      >
        {steps.map((step) => (
          <div 
            key={step.num}
            style={{
              position: 'relative',
              flexShrink: 0,
              width: '320px',
              height: '400px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.5s ease',
              cursor: 'default',
              whiteSpace: 'normal'
            }}
          >
            <div>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '16px' }}>{step.icon}</span>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F0EEE4', fontFamily: 'Syne, sans-serif', marginBottom: '12px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{step.desc}</p>
            </div>
            <span 
              style={{
                fontSize: '6rem', 
                fontWeight: 800, 
                color: 'rgba(255,255,255,0.05)', 
                fontFamily: 'Syne, sans-serif', 
                lineHeight: 1,
                position: 'absolute', 
                bottom: '16px', 
                right: '24px',
              }}
            >
              {step.num}
            </span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', width: '192px', height: '2px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
        <div ref={progressRef} style={{ height: '100%', background: '#2563EB', borderRadius: '9999px', width: '0%', transition: 'none' }} />
      </div>
    </section>
  );
};

export default ElectionTimeline;
