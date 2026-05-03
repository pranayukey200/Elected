import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ── Mock GSAP (ScrollTrigger requires real browser DOM) ────────────────────────
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn(), from: vi.fn(), fromTo: vi.fn() })),
    context: vi.fn((fn: () => void) => { fn(); return { revert: vi.fn() }; }),
  },
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn(), kill: vi.fn() },
  gsap: {
    registerPlugin: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    set: vi.fn(),
    context: vi.fn((fn: () => void) => { fn(); return { revert: vi.fn() }; }),
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn(), kill: vi.fn() },
}));

// ── Mock matchMedia (not available in jsdom) ─────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── Mock ResizeObserver ───────────────────────────────────────────────────────
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ── Mock IntersectionObserver ─────────────────────────────────────────────────
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(() => []),
}));

// ── Mock canvas (Three.js) ───────────────────────────────────────────────────
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  fillRect: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
});

// ── Mock Anthropic SDK ────────────────────────────────────────────────────────
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        [Symbol.asyncIterator]: async function* () {
          yield {
            type: 'content_block_delta',
            delta: { type: 'text_delta', text: 'Elections are democratic processes.' },
          };
        },
      }),
    },
  })),
}));

// ── Mock DOMPurify ───────────────────────────────────────────────────────────
vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn((input: string) => input),
  },
}));

// ── Silence framer-motion animation warnings in tests ────────────────────────
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useInView: vi.fn(() => true), // treat everything as in-view
    LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  };
});

// ── Mock scrollIntoView ───────────────────────────────────────────────────────
Element.prototype.scrollIntoView = vi.fn();

// ── Mock Firebase to prevent real network calls in tests ─────────────────────
vi.mock('../lib/firebase', () => ({
  logFirebaseEvent: vi.fn(),
  app: {},
  analytics: null,
  perf: null,
}));

// ── Mock Leaflet to prevent DOM errors in tests ───────────────────────────────
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(), on: vi.fn(), remove: vi.fn(), flyTo: vi.fn(),
      getZoom: vi.fn(() => 2), addLayer: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    divIcon: vi.fn(() => ({})),
    marker: vi.fn(() => ({ addTo: vi.fn(), on: vi.fn() })),
  },
}));
