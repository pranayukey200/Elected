import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSection from '../components/HeroSection';

// framer-motion is mocked in setup.ts (useInView → true)
vi.mock('../utils/analytics', () => ({
  trackCTAClick: vi.fn(),
  trackSectionViewed: vi.fn(),
  trackEvent: vi.fn(),
}));

describe('HeroSection', () => {
  it('renders the main heading words', () => {
    render(<HeroSection />);
    expect(screen.getByText('Understand')).toBeInTheDocument();
    expect(screen.getByText('Your')).toBeInTheDocument();
    expect(screen.getByText('Vote')).toBeInTheDocument();
  });

  it('renders the subheading describing the platform', () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/step-by-step guide to how elections work/i)
    ).toBeInTheDocument();
  });

  it('renders both CTA buttons', () => {
    render(<HeroSection />);
    expect(screen.getByRole('button', { name: /start learning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore timeline/i })).toBeInTheDocument();
  });

  it('renders floating badge for "2026 Elections"', () => {
    render(<HeroSection />);
    expect(screen.getByText(/2026 elections/i)).toBeInTheDocument();
  });

  it('renders floating badge for "Verified Info"', () => {
    render(<HeroSection />);
    expect(screen.getByText(/verified info/i)).toBeInTheDocument();
  });

  it('renders scroll indicator text', () => {
    render(<HeroSection />);
    expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument();
  });
});
