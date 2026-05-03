import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ElectionTimeline from '../components/ElectionTimeline';
import { ELECTION_STEPS } from '../constants/electionSteps';

vi.mock('../utils/analytics', () => ({
  trackTimelineStep: vi.fn(),
  trackSectionViewed: vi.fn(),
}));

describe('ElectionTimeline', () => {
  it('renders the section heading', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText(/8 steps to democracy/i)).toBeInTheDocument();
  });

  it('renders all 8 election step titles', () => {
    render(<ElectionTimeline />);
    ELECTION_STEPS.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('renders all 8 step descriptions', () => {
    render(<ElectionTimeline />);
    ELECTION_STEPS.forEach((step) => {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it('renders step number labels 01 through 08', () => {
    render(<ElectionTimeline />);
    ['01', '02', '03', '04', '05', '06', '07', '08'].forEach((num) => {
      expect(screen.getAllByText(num).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders the section label "Election Process"', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText(/election process/i)).toBeInTheDocument();
  });

  it('renders dot navigation buttons', () => {
    render(<ElectionTimeline />);
    // 8 nav dots
    const navButtons = screen.getAllByRole('button');
    expect(navButtons.length).toBeGreaterThanOrEqual(8);
  });
});
