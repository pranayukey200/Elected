import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { isValidInput } from '../utils/sanitize';
import { trackChatOpen, trackStarterQuestion } from '../utils/analytics';
import { STARTER_QUESTIONS } from '../constants/electionSteps';

const TYPING_DOT_STYLE: React.CSSProperties = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: '#3b82f6',
  display: 'inline-block',
};

const ChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, rateLimit } = useChat();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      trackChatOpen();
    }
  }, [isOpen]);

  // Update ARIA live region when a new assistant message arrives
  const lastAssistantMsg = messages.filter((m) => m.role === 'assistant').at(-1);
  useEffect(() => {
    if (liveRegionRef.current && lastAssistantMsg && !lastAssistantMsg.streaming) {
      liveRegionRef.current.textContent = lastAssistantMsg.content;
    }
  }, [lastAssistantMsg]);

  const handleSend = useCallback(() => {
    if (isValidInput(inputValue) && !isLoading && !rateLimit.isLimited) {
      sendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, isLoading, rateLimit.isLimited, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [handleSend]
  );

  const handleStarterClick = useCallback(
    (q: string) => {
      trackStarterQuestion(q);
      sendMessage(q);
    },
    [sendMessage]
  );

  const showStarters = messages.length <= 1 && !isLoading;

  return (
    <>
      {/* ARIA live region for screen readers */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />

      {/* Floating chat bubble */}
      <motion.button
        id="chat-bubble-btn"
        aria-label="Open election assistant chat"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          border: 'none',
          cursor: 'pointer',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 0 rgba(59,130,246,0.4)',
          animation: 'pulse-glow 2.5s ease-in-out infinite',
          zIndex: 1100,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} color="white" aria-hidden="true" />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ef4444',
            fontSize: '9px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            border: '2px solid #0a0a0f',
          }}
        >
          AI
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Election assistant chat panel"
            aria-modal="true"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '420px',
              maxWidth: 'calc(100vw - 32px)',
              height: '580px',
              maxHeight: 'calc(100vh - 80px)',
              background: 'rgba(8,12,24,0.97)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1100,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(8,12,24,0.9))',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(59,130,246,0.4)',
                  flexShrink: 0,
                }}
              >
                <Bot size={20} color="white" />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#e1e0cc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Ask About Elections
                  <Sparkles size={13} color="#3b82f6" aria-hidden="true" />
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(225,224,204,0.45)', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                  Powered by Groq · Non-partisan · Educational
                </div>
              </div>

              {/* Online dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginRight: '8px' }} aria-hidden="true">
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '11px', color: '#10b981', fontFamily: 'Inter, sans-serif' }}>Live</span>
              </div>

              <button
                aria-label="Close chat panel"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(225,224,204,0.6)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.outline = '2px solid #3b82f6'; }}
                onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(225,224,204,0.6)'; }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* ── Messages ── */}
            <div
              role="log"
              aria-label="Chat messages"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59,130,246,0.3) transparent',
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: '8px',
                    alignItems: 'flex-end',
                  }}
                >
                  {msg.role === 'assistant' && (
                    <div
                      aria-hidden="true"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginBottom: '2px',
                      }}
                    >
                      <Bot size={14} color="white" />
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.05)',
                      border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      fontSize: '13.5px',
                      lineHeight: 1.65,
                      color: msg.role === 'user' ? 'white' : '#e1e0cc',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}

                    {/* Typing indicator — empty streaming message */}
                    {msg.streaming && msg.content === '' && (
                      <div role="status" aria-label="Assistant is typing" style={{ display: 'flex', gap: '4px', padding: '4px 0', alignItems: 'center' }}>
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            style={{
                              ...TYPING_DOT_STYLE,
                              animation: `typing-bounce 1.4s ease-in-out infinite`,
                              animationDelay: `${i * 0.16}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Streaming cursor */}
                    {msg.streaming && msg.content !== '' && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'inline-block',
                          width: '2px',
                          height: '14px',
                          background: '#3b82f6',
                          marginLeft: '2px',
                          animation: 'typing-bounce 1s ease-in-out infinite',
                          verticalAlign: 'middle',
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Starter questions ── */}
            <AnimatePresence>
              {showStarters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                  aria-label="Suggested questions"
                >
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleStarterClick(q)}
                      aria-label={`Ask: ${q}`}
                      style={{
                        background: 'rgba(59,130,246,0.08)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        borderRadius: '100px',
                        padding: '6px 12px',
                        fontSize: '11.5px',
                        color: '#60a5fa',
                        fontFamily: 'Inter, sans-serif',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                      onFocus={(e) => { e.currentTarget.style.outline = '2px solid #3b82f6'; e.currentTarget.style.outlineOffset = '2px'; }}
                      onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
                    >
                      <ChevronRight size={11} aria-hidden="true" />
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Error / rate limit notice ── */}
            <AnimatePresence>
              {(error || rateLimit.isLimited) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  style={{
                    margin: '0 16px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#fca5a5',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.5,
                    marginBottom: '8px',
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
                  {rateLimit.isLimited
                    ? `Rate limit reached (10 msg/min). Resets in ${Math.ceil((rateLimit.resetIn ?? 60000) / 1000)}s.`
                    : error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div
              style={{
                padding: '12px 16px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <label htmlFor="chat-input" style={{ position: 'absolute', left: '-9999px' }}>
                Type your election question
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={rateLimit.isLimited ? 'Rate limit reached...' : 'Ask about elections...'}
                disabled={isLoading || rateLimit.isLimited}
                aria-disabled={isLoading || rateLimit.isLimited}
                maxLength={2000}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  color: '#e1e0cc',
                  fontSize: '13.5px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  opacity: rateLimit.isLimited ? 0.5 : 1,
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={isLoading || !isValidInput(inputValue) || rateLimit.isLimited}
                aria-label="Send message"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background:
                    isValidInput(inputValue) && !isLoading && !rateLimit.isLimited
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isValidInput(inputValue) && !isLoading && !rateLimit.isLimited ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.outline = '2px solid #3b82f6'; e.currentTarget.style.outlineOffset = '2px'; }}
                onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
              >
                <Send
                  size={16}
                  color={isValidInput(inputValue) && !isLoading && !rateLimit.isLimited ? 'white' : 'rgba(225,224,204,0.3)'}
                  aria-hidden="true"
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(ChatPanel);
