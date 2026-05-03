import { useState, useCallback, useRef } from 'react';
import { sanitizeInput } from '../utils/sanitize';
import { trackChatMessage } from '../utils/analytics';
import { useRateLimit } from './useRateLimit';
import { CHAT_SYSTEM_PROMPT } from '../constants/electionSteps';
import type { ChatMessage, ChatState } from '../types';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your non-partisan election education assistant. Ask me anything about the voting process, election laws, or civic duties. How can I help you today?",
  timestamp: Date.now(),
};

export interface UseChatReturn extends ChatState {
  sendMessage: (text: string) => Promise<void>;
  rateLimit: ReturnType<typeof useRateLimit>;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rateLimit = useRateLimit();

  const lastSendTime = useRef(0);

  const sendMessage = useCallback(
    async (rawText: string): Promise<void> => {
      const now = Date.now();
      if (now - lastSendTime.current < 300) return;
      lastSendTime.current = now;

      const text = sanitizeInput(rawText);
      if (!text || isLoading) return;

      const allowed = rateLimit.recordCall();
      if (!allowed) {
        setError(
          `You've reached the limit of 10 messages per minute. Please wait ${Math.ceil(
            (rateLimit.resetIn ?? 60000) / 1000
          )} seconds.`
        );
        return;
      }

      setError(null);

      const userMsg: ChatMessage = {
        id: `user-${now}`,
        role: 'user',
        content: text,
        timestamp: now,
      };
      const assistantId = `assistant-${now + 1}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
        timestamp: now + 1,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsLoading(true);
      trackChatMessage();

      try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        
        if (!apiKey) {
          throw new Error('API Key is missing. Please add VITE_GROQ_API_KEY to your .env file and RESTART the dev server.');
        }

        const chatMessages = [
          { role: 'system', content: CHAT_SYSTEM_PROMPT },
          ...messages.filter((m) => m.id !== 'welcome').map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user', content: userMsg.content }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: chatMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Groq API Error Response:', errorData);
          throw new Error(errorData.error?.message || `Groq API Error: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to open response stream');
        
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last partial line in the buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
            
            if (trimmedLine.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmedLine.substring(6));
                const content = data.choices[0]?.delta?.content || '';
                if (content) {
                  fullText += content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: fullText } : m
                    )
                  );
                }
              } catch (e) {
                console.warn('Skipping partial/invalid JSON line:', trimmedLine);
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
      } catch (e: any) {
        console.error('Chat Assistant Error:', e);
        const errorMessage = e.name === 'TypeError' && e.message === 'Failed to fetch' 
          ? 'Network Error: Check your connection or CORS settings. Groq might be unreachable.'
          : e.message || 'An unexpected error occurred.';
          
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `⚠️ Error: ${errorMessage}`, streaming: false }
              : m
          )
        );
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, rateLimit]
  );

  return { messages, isLoading, error, sendMessage, rateLimit };
};
