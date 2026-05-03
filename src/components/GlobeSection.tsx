import React from 'react';
import { ElectionGlobe } from './ElectionGlobe';

const GlobeSection: React.FC = () => {
  return (
    <section id="globe" className="relative">
      {/* Background radial accent */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ElectionGlobe />
      </div>
    </section>
  );
};

export default GlobeSection;
