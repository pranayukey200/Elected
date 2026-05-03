import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatPanel from '../components/ChatPanel';

vi.mock('../utils/analytics', () => ({
  trackChatOpen: vi.fn(),
  trackChatMessage: vi.fn(),
  trackStarterQuestion: vi.fn(),
  trackSectionViewed: vi.fn(),
}));

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chat bubble button', () => {
    render(<ChatPanel />);
    expect(screen.getByRole('button', { name: /open election assistant chat/i })).toBeInTheDocument();
  });

  it('opens the chat panel when bubble is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);

    const bubble = screen.getByRole('button', { name: /open election assistant chat/i });
    await user.click(bubble);

    expect(screen.getByRole('dialog', { name: /election assistant chat panel/i })).toBeInTheDocument();
  });

  it('displays the welcome message on open', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    expect(screen.getByText(/non-partisan election education assistant/i)).toBeInTheDocument();
  });

  it('closes the panel when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close chat panel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes the panel on Escape key', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    const input = screen.getByRole('textbox');
    await user.type(input, '{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('sends a message when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    const input = screen.getByRole('textbox');
    await user.type(input, 'How do I vote?');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByText('How do I vote?')).toBeInTheDocument();
    });
  });

  it('sends a message when send button is clicked', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    const input = screen.getByRole('textbox');
    await user.type(input, 'What is the Electoral College?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText('What is the Electoral College?')).toBeInTheDocument();
    });
  });

  it('shows AI response after sending a message', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    const input = screen.getByRole('textbox');
    await user.type(input, 'How are elections held?');
    await user.keyboard('{Enter}');

    await waitFor(
      () => {
        expect(screen.getByText(/elections are democratic processes/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('renders starter question pills', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    expect(screen.getByRole('button', { name: /ask: how do i register to vote/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ask: what is the electoral college/i })).toBeInTheDocument();
  });

  it('blocks sending after rate limit is exceeded', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    const input = screen.getByRole('textbox');

    // Send 10 messages to hit the rate limit
    for (let i = 0; i < 10; i++) {
      await user.clear(input);
      await user.type(input, `Question ${i}`);
      await user.keyboard('{Enter}');
    }

    // Try one more — should be blocked
    await user.clear(input);
    await user.type(input, 'One more');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('has an aria-live region for screen readers', async () => {
    const user = userEvent.setup();
    render(<ChatPanel />);
    await user.click(screen.getByRole('button', { name: /open election assistant chat/i }));

    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });
});
