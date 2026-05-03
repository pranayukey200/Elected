

const crosses = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 10 + 8,
  duration: Math.random() * 6 + 8,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.25 + 0.05,
}));

export const CrosshairParticles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden' }}>
    {crosses.map(({ id, x, y, size, duration, delay, opacity }) => (
      <div
        key={id}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          opacity,
          animation: `floatCross ${duration}s ease-in-out ${delay}s infinite alternate`
        }}
      >
        <svg width={size} height={size} viewBox="0 0 10 10">
          <line x1="5" y1="0" x2="5" y2="10" stroke="#E0EEF4" strokeWidth="0.8"/>
          <line x1="0" y1="5" x2="10" y2="5" stroke="#E0EEF4" strokeWidth="0.8"/>
        </svg>
      </div>
    ))}
  </div>
);
