/**
 * @file useFirebaseAnalytics.ts
 * @description React hook that fires Firebase Analytics events on
 * component mount and user interactions.
 *
 * [Google Services] Uses Firebase Analytics + Performance Monitoring.
 * [Efficiency]      Lazy-initialized — no overhead on SSR/static render.
 * [Accessibility]   Tracks section visibility to drive UX improvements.
 */
import { useEffect, useCallback } from 'react';
import { logFirebaseEvent } from '../lib/firebase';

export const useFirebaseAnalytics = (sectionName: string) => {
  // Fire a "section_view" event when the component first mounts
  useEffect(() => {
    logFirebaseEvent('section_view', { section: sectionName });
  }, [sectionName]);

  /**
   * Fire a custom interaction event (e.g. button click, map marker click).
   */
  const trackInteraction = useCallback(
    (action: string, label?: string) => {
      logFirebaseEvent('user_interaction', {
        section: sectionName,
        action,
        ...(label ? { label } : {}),
      });
    },
    [sectionName]
  );

  return { trackInteraction };
};
