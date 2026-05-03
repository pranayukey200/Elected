import type { AnalyticsEventName } from '../types';

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      target: string | Date,
      params?: Record<string, string | number | boolean>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fires a GA4 event only when gtag is available (i.e. when the GA snippet
 * has been loaded in index.html with a real Measurement ID).
 */
export const trackEvent = (
  name: AnalyticsEventName,
  params: Record<string, string | number | boolean> = {}
): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
};

export const trackPageView = (path: string = window.location.pathname): void => {
  trackEvent('page_view', { page_path: path });
};

export const trackSectionViewed = (sectionId: string): void => {
  trackEvent('section_viewed', { section_id: sectionId });
};

export const trackCTAClick = (label: string): void => {
  trackEvent('cta_click', { button_label: label });
};

export const trackChatOpen = (): void => {
  trackEvent('chat_open', {});
};

export const trackChatMessage = (): void => {
  trackEvent('chat_message_sent', {});
};

export const trackStarterQuestion = (question: string): void => {
  trackEvent('starter_question_click', { question });
};

export const trackTimelineStep = (stepTitle: string): void => {
  trackEvent('timeline_step_click', { step_title: stepTitle });
};

export const trackQuizCompletion = (score: number): void => {
  trackEvent('quiz_completion', { score });
};
