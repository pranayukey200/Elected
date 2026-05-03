import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Vote } from 'lucide-react';

const faqs = [
  {
    q: 'Who is eligible to vote?',
    a: 'Eligibility varies by country. In the United States, you must be a U.S. citizen, at least 18 years old on Election Day, and registered to vote in your state. Some states allow 17-year-olds to vote in primaries if they will be 18 by the general election.',
  },
  {
    q: 'What is the Electoral College?',
    a: 'The Electoral College is the system used in the U.S. presidential elections. Each state is allocated electors equal to its total Congressional representation (House + Senate). Candidates need 270 of 538 electoral votes to win. Most states award all their electoral votes to the candidate who wins the popular vote in that state.',
  },
  {
    q: 'How are votes counted and verified?',
    a: 'Ballots are counted by local election officials, often using optical scanners or hand counts. Results go through multiple verification layers: provisional ballot review, reconciliation of voter rolls, and mandatory audits. Many states conduct post-election audits comparing machine tallies with paper records.',
  },
  {
    q: 'What is gerrymandering?',
    a: 'Gerrymandering is the manipulation of electoral district boundaries to favor a particular political party or group. It can dilute the voting power of certain communities. Many states have moved to independent redistricting commissions to create fairer maps.',
  },
  {
    q: 'Can I vote by mail?',
    a: 'Mail-in voting (absentee voting) is available in most U.S. states. Some states automatically send all registered voters a mail-in ballot, while others require you to request one. Rules vary by state — check your local election authority for deadlines and requirements.',
  },
  {
    q: 'What happens after Election Day?',
    a: 'After polls close, unofficial results are reported. Over the following days/weeks: provisional and mail-in ballots are counted, results are canvassed and certified by local and state officials, and any legal challenges are resolved. The certified winner is then inaugurated into office.',
  },
];

const FAQItem: React.FC<{ faq: typeof faqs[0]; index: number }> = ({ faq, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        borderRadius: '14px',
        border: `1px solid ${open ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.07)'}`,
        background: open ? 'rgba(59,130,246,0.06)' : 'rgba(15,20,40,0.5)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div
        style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '15px',
            fontWeight: 600,
            color: open ? '#60a5fa' : '#e1e0cc',
            transition: 'color 0.2s ease',
            lineHeight: 1.4,
          }}
        >
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} color={open ? '#3b82f6' : 'rgba(225,224,204,0.4)'} />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 24px 20px',
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'rgba(225,224,204,0.7)',
                fontFamily: 'Inter, sans-serif',
                borderTop: '1px solid rgba(59,130,246,0.15)',
                paddingTop: '16px',
              }}
            >
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="faq" ref={ref} style={{ padding: '100px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <p className="section-label">Common Questions</p>
          <h2
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              letterSpacing: '2px',
              lineHeight: 1,
              background: 'linear-gradient(180deg, #e1e0cc 0%, rgba(225,224,204,0.55) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px',
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            style={{
              color: 'rgba(225,224,204,0.5)',
              fontSize: '16px',
              fontFamily: 'Space Grotesk, sans-serif',
              lineHeight: 1.6,
            }}
          >
            Answers to the most common questions about elections and voting.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  const navLinks = [
    { label: 'Timeline', id: 'timeline' },
    { label: 'Stats', id: 'stats' },
    { label: 'Globe', id: 'globe' },
    { label: 'FAQ', id: 'faq' },
    { label: 'About', id: 'about' },
  ];

  return (
    <footer
      id="about"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 32px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradient accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(239,68,68,0.3), transparent)',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* Logo + tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3b82f6, #ef4444)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(59,130,246,0.4)',
                }}
              >
                <Vote size={18} color="white" />
              </div>
              <span
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '22px',
                  letterSpacing: '3px',
                  background: 'linear-gradient(90deg, #60a5fa, #e1e0cc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ElectED
              </span>
            </div>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(225,224,204,0.45)',
                fontFamily: 'Inter, sans-serif',
                maxWidth: '240px',
                lineHeight: 1.6,
              }}
            >
              Empowering citizens through transparent, non-partisan election education.
            </p>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {navLinks.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(225,224,204,0.5)',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(225,224,204,0.5)'; }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '28px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(225,224,204,0.4)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.7,
              textAlign: 'center',
            }}
          >
            ⚖️{' '}
            <strong style={{ color: 'rgba(225,224,204,0.6)' }}>Non-Partisan Disclaimer:</strong>{' '}
            This platform is non-partisan and designed for educational purposes only. All information
            presented is intended to inform citizens about election processes and civic participation,
            without promoting any political party, candidate, or ideology.
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(225,224,204,0.3)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            © 2026 ElectED. Built to strengthen democracy.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Sources', 'Privacy', 'Accessibility'].map((link) => (
              <button
                key={link}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(225,224,204,0.3)',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(225,224,204,0.3)'; }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export { FAQSection };
export default Footer;
