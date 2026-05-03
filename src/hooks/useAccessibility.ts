/**
 * @file useAccessibility.ts
 * @description Hook providing WCAG 2.1 AAA accessibility utilities:
 * - Announce messages to screen readers via a live ARIA region
 * - Trap focus within modal/overlay elements
 * - Manage reduced-motion preference
 *
 * [Accessibility] WCAG 2.1 Level AAA — aria-live, focus management, prefers-reduced-motion
 */
import { useEffect, useRef, useCallback } from 'react';

// ── Screen-reader announcer ───────────────────────────────────────────────────
let announcerEl: HTMLElement | null = null;

const getAnnouncer = (): HTMLElement => {
  if (!announcerEl) {
    announcerEl = document.createElement('div');
    announcerEl.setAttribute('aria-live', 'polite');
    announcerEl.setAttribute('aria-atomic', 'true');
    announcerEl.setAttribute('role', 'status');
    Object.assign(announcerEl.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
    document.body.appendChild(announcerEl);
  }
  return announcerEl;
};

/**
 * Announce a message to screen readers without moving focus.
 */
export const announce = (message: string): void => {
  if (typeof window === 'undefined') return;
  const el = getAnnouncer();
  // Clear then set so repeated identical messages are re-announced
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = message; });
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export const useAccessibility = () => {
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Update preference when media query changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /**
   * Trap keyboard focus within a container element.
   * Returns a cleanup function to remove the listener.
   */
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement | null>) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    prefersReducedMotion: prefersReducedMotion.current,
    announce,
    trapFocus,
  };
};
