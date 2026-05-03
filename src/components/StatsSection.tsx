import React, { useRef, useEffect, useState } from 'react';
import { Globe2, Users, ListChecks, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NETWORK_VIDEO = "https://cdn.mixkit.co/videos/preview/mixkit-network-of-connections-in-space-23734-large.mp4";

const stats = [
  {
    icon: Globe2,
    value: 150,
    suffix: '+',
    label: 'Countries Hold Elections',
    color: '#3b82f6',
    description: 'Democratic nations worldwide',
  },
  {
    icon: Users,
    value: 4.2,
    suffix: 'B',
    label: 'Eligible Voters Worldwide',
    color: '#ef4444',
    description: 'People with the right to vote',
  },
  {
    icon: ListChecks,
    value: 8,
    suffix: '',
    label: 'Steps to Certified Result',
    color: '#f59e0b',
    description: 'From registration to inauguration',
  },
  {
    icon: TrendingUp,
    value: 68,
    suffix: '%',
    label: 'Avg Global Voter Turnout',
    color: '#10b981',
    description: 'In most recent national elections',
  },
];

const useCountUp = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      setCount(isDecimal ? Math.round(val * 10) / 10 : Math.floor(val));
      if (current >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

const StatCard: React.FC<{ stat: typeof stats[0] }> = ({ stat }) => {
  const count = useCountUp(stat.value, 2200);
  const [hovered, setHovered] = useState(false);
  const Icon = stat.icon;

  return (
    <div
      className="stat-card group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 220px',
        background: hovered
          ? `linear-gradient(135deg, ${stat.color}15, rgba(15,20,40,0.8))`
          : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? stat.color + '50' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: '16px',
        padding: '36px 28px',
        textAlign: 'center',
        cursor: 'default',
        transition: 'all 0.35s ease',
        boxShadow: hovered
          ? `0 0 40px ${stat.color}30, 0 20px 60px rgba(0,0,0,0.4)`
          : '0 8px 32px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: `${stat.color}18`,
          border: `1px solid ${stat.color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: `0 0 24px ${stat.color}30`,
          transition: 'all 0.3s ease',
          transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        }}
      >
        <Icon size={24} color={stat.color} />
      </div>
      <div
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '64px',
          lineHeight: 1,
          letterSpacing: '-1px',
          color: stat.color,
          textShadow: `0 0 30px ${stat.color}60`,
          marginBottom: '8px',
        }}
      >
        {stat.value % 1 !== 0 ? count.toFixed(1) : Math.floor(count as number)}
        <span style={{ fontSize: '40px' }}>{stat.suffix}</span>
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          fontWeight: 700,
          color: '#F0EEE4',
          marginBottom: '6px',
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          color: '#6B7280',
        }}
      >
        {stat.description}
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stat-card');
      cards.forEach((card: any, i) => {
        gsap.fromTo(card,
          { y: 80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none', // NEVER reverses
              once: true,
            },
            duration: 0.8,
            delay: i * 0.12,
            ease: 'power3.out',
          }
        );
      });

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
    <section id="stats" ref={ref} style={{ padding: '100px 0', position: 'relative', background: '#05050A' }}>
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
        src={NETWORK_VIDEO}
      />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            By The Numbers
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
            Democracy in Numbers
          </h2>
          <p
            style={{
              color: '#6B7280',
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            The scale of global democracy — visualized through key statistics.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
