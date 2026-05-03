import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ElectionTimeline from '../components/ElectionTimeline';

vi.mock('../utils/analytics', () => ({
  trackTimelineStep: vi.fn(),
  trackSectionViewed: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
  logFirebaseEvent: vi.fn(),
}));

describe('ElectionTimeline', () => {
  it('renders without crashing', () => {
    const { container } = render(<ElectionTimeline />);
    expect(container).toBeInTheDocument();
  });

  it('renders a section with id="timeline"', () => {
    render(<ElectionTimeline />);
    expect(document.getElementById('timeline')).toBeInTheDocument();
  });

  it('renders Voter Registration step', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
  });

  it('renders Candidate Nomination step', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText('Candidate Nomination')).toBeInTheDocument();
  });

  it('renders Campaigning Period step', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText('Campaigning Period')).toBeInTheDocument();
  });

  it('renders Election Day step', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText('Election Day')).toBeInTheDocument();
  });

  it('renders step number labels 01 through 08', () => {
    render(<ElectionTimeline />);
    ['01', '02', '03', '04', '05', '06', '07', '08'].forEach((num) => {
      expect(screen.getAllByText(num).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders the scroll to explore text', () => {
    render(<ElectionTimeline />);
    expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument();
  });
});
