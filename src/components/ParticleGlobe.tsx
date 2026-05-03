import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Globe = () => {
  const meshRef = useRef<THREE.Points>(null);
  const count = 4000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      pos[i * 3]     = 2 * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = 2 * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = 2 * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#2563EB" size={0.018} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

export const ParticleGlobe = () => (
  <div style={{ width: '100%', height: '600px', pointerEvents: 'none' }}>
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <Globe />
    </Canvas>
  </div>
);
