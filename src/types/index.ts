// ─── Chat ─────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  streaming?: boolean;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// ─── Election Steps ────────────────────────────────────────────────────────────

export interface ElectionStep {
  number: string;
  title: string;
  description: string;
  detail: string;
  color: string;
  iconName: string;
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
  iconName: string;
}

// ─── Globe ─────────────────────────────────────────────────────────────────────

export interface DemocracyCountry {
  name: string;
  lat: number;
  lon: number;
  year: number;
}

// ─── Analytics ─────────────────────────────────────────────────────────────────

export type AnalyticsEventName =
  | 'page_view'
  | 'cta_click'
  | 'timeline_step_click'
  | 'chat_open'
  | 'chat_message_sent'
  | 'section_viewed'
  | 'starter_question_click'
  | 'quiz_completion';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  params?: Record<string, string | number | boolean>;
}

// ─── Rate Limiter ──────────────────────────────────────────────────────────────

export interface RateLimitState {
  count: number;
  resetAt: number;
}
