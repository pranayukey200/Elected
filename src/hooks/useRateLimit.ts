/* eslint-disable react-hooks/purity */
import { useState, useCallback, useRef } from 'react';
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '../constants/electionSteps';

export interface UseRateLimitReturn {
  isLimited: boolean;
  remaining: number;
  recordCall: () => boolean; // returns false if rate-limited
  resetIn: number | null; // ms until window resets
}

export const useRateLimit = (): UseRateLimitReturn => {
  const [count, setCount] = useState(0);
  const [windowStart, setWindowStart] = useState<number>(Date.now());
  const countRef = useRef(0);
  const windowRef = useRef<number>(Date.now());

  const recordCall = useCallback((): boolean => {
    const now = Date.now();

    // Reset window if it has expired
    if (now - windowRef.current >= RATE_LIMIT_WINDOW_MS) {
      windowRef.current = now;
      countRef.current = 0;
      setCount(0);
      setWindowStart(now);
    }

    if (countRef.current >= RATE_LIMIT_MAX) {
      return false; // blocked
    }

    countRef.current += 1;
    setCount(countRef.current);
    return true; // allowed
  }, []);

  const now = Date.now();
  const elapsed = now - windowStart;
  const isLimited = count >= RATE_LIMIT_MAX && elapsed < RATE_LIMIT_WINDOW_MS;
  const resetIn = isLimited ? RATE_LIMIT_WINDOW_MS - elapsed : null;

  return {
    isLimited,
    remaining: Math.max(0, RATE_LIMIT_MAX - count),
    recordCall,
    resetIn,
  };
};
