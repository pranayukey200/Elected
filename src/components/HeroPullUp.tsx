import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const HeroPullUp = ({ text, gold }: { text: string; gold?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const words = text.split(' ');

  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'inline-block' }}>
      {words.map((word, i) => {
        const isGold = word === gold || word === gold + '.' || word === gold + '.*';
        const cleanWord = word.replace(/\*/g, ''); // strip asterisks from bold formatting if any
        return (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.3em',
              fontFamily: isGold ? "'Playfair Display', serif" : 'inherit',
              fontStyle: isGold ? 'italic' : 'normal',
              color: isGold ? '#D4A017' : 'inherit',
            }}
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {cleanWord}
          </motion.span>
        );
      })}
    </div>
  );
};
