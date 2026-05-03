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

  // Debounce guard — prevents double-sends from rapid keypresses
  const lastSendTime = useRef(0);

  const sendMessage = useCallback(
    async (rawText: string): Promise<void> => {
      // Debounce: ignore calls within 300 ms of the last one
      const now = Date.now();
      if (now - lastSendTime.current < 300) return;
      lastSendTime.current = now;

      const text = sanitizeInput(rawText);
      if (!text || isLoading) return;

      // Rate limit check
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
        const apiKey = import.meta.env.VITE_GROQ_API_KEY ?? '';
        if (!apiKey) throw new Error('No API Key');

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
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: chatMessages,
            stream: true,
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          for (const line of lines) {
            if (line.includes('[DONE]')) break;
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.replace(/^data: /, ''));
                if (data.choices[0].delta.content) {
                  fullText += data.choices[0].delta.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId ? { ...m, content: fullText } : m
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing stream data', e);
              }
            }
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
      } catch (e) {
        console.error(e);
        const errMsg =
          'Unable to connect to the AI service. Please verify your VITE_GROQ_API_KEY is configured in .env';
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: errMsg, streaming: false }
              : m
          )
        );
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, rateLimit]
  );

  return { messages, isLoading, error, sendMessage, rateLimit };
};
