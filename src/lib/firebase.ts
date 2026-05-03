/**
 * @file firebase.ts
 * @description Firebase app initialization with Performance Monitoring and Analytics.
 * Integrates Google Services: Firebase Analytics + Performance Monitoring.
 */
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_ADMIN_SDK_KEY,
  authDomain: 'elected-adcd4.firebaseapp.com',
  projectId: 'elected-adcd4',
  storageBucket: 'elected-adcd4.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456',
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-PLACEHOLDER',
};

// Singleton pattern — never double-initialize
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Google services (browser only)
let analytics: ReturnType<typeof getAnalytics> | null = null;
let perf: ReturnType<typeof getPerformance> | null = null;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    perf = getPerformance(app);
  } catch {
    // Gracefully degrade if Firebase services are unavailable
    console.warn('[Firebase] Services unavailable — running in offline mode.');
  }
}

/**
 * Log a named event to Firebase Analytics.
 * No-op if analytics failed to initialize (offline / blocked).
 */
export const logFirebaseEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, params);
    } catch {
      // Silently fail — never break user experience for analytics
    }
  }
};

export { app, analytics, perf };
