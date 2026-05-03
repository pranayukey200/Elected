import { useEffect, useRef } from 'react';

export const MagneticCursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    const move = (e: MouseEvent) => { 
      mouseX = e.clientX; 
      mouseY = e.clientY; 
    };
    window.addEventListener('mousemove', move);

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (dot.current)  { dot.current.style.transform  = `translate(${mouseX}px, ${mouseY}px)`; }
      if (ring.current) { ring.current.style.transform = `translate(${ringX}px, ${ringY}px)`; }
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div 
        ref={dot} 
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
          width: '8px', height: '8px', marginLeft: '-4px', marginTop: '-4px', 
          borderRadius: '50%', background: '#2563EB', mixBlendMode: 'difference'
        }} 
      />
      <div 
        ref={ring} 
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9998, pointerEvents: 'none',
          width: '32px', height: '32px', marginLeft: '-16px', marginTop: '-16px', 
          borderRadius: '50%', border: '1px solid rgba(37,99,235,0.6)', 
          transition: 'transform 0s' // handled by RAF
        }} 
      />
    </>
  );
};
