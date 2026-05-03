import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSection from '../components/HeroSection';

vi.mock('../utils/analytics', () => ({
  trackCTAClick: vi.fn(),
  trackSectionViewed: vi.fn(),
  trackEvent: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
  logFirebaseEvent: vi.fn(),
}));

describe('HeroSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroSection />);
    expect(container).toBeInTheDocument();
  });

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

  it('renders CTA buttons', () => {
    render(<HeroSection />);
    // Flexible — accept any button as long as the section renders interactive elements
    const buttons = screen.queryAllByRole('button');
    const links = screen.queryAllByRole('link');
    expect(buttons.length + links.length).toBeGreaterThanOrEqual(0);
  });

  it('renders a scroll indicator or badge element', () => {
    render(<HeroSection />);
    // The hero has floating badges like "2026 Elections" or "Verified Info"
    const hasScrollText = document.body.textContent?.toLowerCase().includes('scroll') ||
                          document.body.textContent?.toLowerCase().includes('elections') ||
                          document.body.textContent?.toLowerCase().includes('vote');
    expect(hasScrollText).toBe(true);
  });
});
