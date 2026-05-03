import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { trackSectionViewed } from '../utils/analytics';

export interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isInView: boolean;
}

/**
 * Wraps framer-motion's useInView with GA4 section-viewed tracking.
 * @param sectionId - the section's id attribute (used for analytics)
 * @param margin - root margin for IntersectionObserver
 */
export const useScrollAnimation = (
  sectionId: string,
  margin: string = '-80px'
): UseScrollAnimationReturn => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once: true,
    margin: margin as `${number}px`,
  });
  const tracked = useRef(false);

  useEffect(() => {
    if (isInView && !tracked.current) {
      tracked.current = true;
      trackSectionViewed(sectionId);
    }
  }, [isInView, sectionId]);

  return { ref, isInView };
};
