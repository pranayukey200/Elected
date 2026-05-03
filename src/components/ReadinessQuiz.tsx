import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { X, Check, ArrowRight, Activity, Share2, Zap } from 'lucide-react';
import html2canvas from 'html2canvas';
import { trackQuizCompletion } from '../utils/analytics';

const QUESTIONS = [
  { id: 'q1', text: 'Are you registered to vote?' },
  { id: 'q2', text: 'Do you know your polling location?' },
  { id: 'q3', text: 'Have you checked your registration status this year?' },
  { id: 'q4', text: 'Do you know what ID is required in your state?' },
  { id: 'q5', text: 'Do you know the candidates on your ballot?' },
  { id: 'q6', text: 'Have you made a voting plan (date, time, transport)?' },
  { id: 'q7', text: 'Do you know your early voting options?' },
  { id: 'q8', text: 'Have you helped someone else register?' },
];

export const ReadinessQuiz: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'notsure'>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [actionPlan, setActionPlan] = useState<string[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (answer: 'yes' | 'no' | 'notsure') => {
    const newAnswers = { ...answers, [QUESTIONS[currentQuestion].id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: typeof answers) => {
    setIsFinished(true);
    setIsGeneratingPlan(true);

    // Calculate score: yes = 1, notsure = 0.5, no = 0
    let totalScore = 0;
    Object.values(finalAnswers).forEach((ans) => {
      if (ans === 'yes') totalScore += 1;
      else if (ans === 'notsure') totalScore += 0.5;
    });
    const percentage = Math.round((totalScore / QUESTIONS.length) * 100);
    trackQuizCompletion(percentage);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY ?? '';
      if (!apiKey) throw new Error('No API Key');

      // Find areas needing improvement
      const weakPoints = QUESTIONS.filter((q) => finalAnswers[q.id] !== 'yes').map(
        (q) => q.text
      );

      const prompt = `
        A user just took a voting readiness quiz and scored ${percentage}%. 
        They answered "No" or "Not Sure" to the following:
        ${weakPoints.length > 0 ? weakPoints.join(', ') : 'None! Perfect score.'}
        
        Generate exactly 3 short, actionable, encouraging bullet points (1 sentence each) on what they should do next to get 100% ready for election day.
        Do not include intro/outro text or markdown formatting. Just the 3 points separated by newlines.
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const text = data.choices[0]?.message?.content || '';
      const points = text
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^[\-\*\d\.]+\s*/, '').trim())
        .slice(0, 3);

      setActionPlan(points);
    } catch (e) {
      console.error('Failed to generate action plan', e);
      setActionPlan([
        'Verify your voter registration status immediately online.',
        'Look up your specific state ID requirements.',
        'Find your polling location and plan your route.',
      ]);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleShare = async () => {
    if (!resultCardRef.current) return;
    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'elected-readiness-score.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My ElectED Readiness Score',
            text: "I'm election ready! Are you? Take the quiz at ElectED.",
            files: [file],
          });
        } else {
          // Fallback: download image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'elected-readiness-score.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error('Error sharing image', err);
    }
  };

  const score = Math.round(
    (Object.values(answers).reduce((acc, ans) => acc + (ans === 'yes' ? 1 : ans === 'notsure' ? 0.5 : 0), 0) /
      QUESTIONS.length) *
      100
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 5, 10, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#0a0f1e',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '24px',
          padding: '40px 32px',
          position: 'relative',
          boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(59,130,246,0.1)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(225,224,204,0.5)',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <X size={24} />
        </button>

        {!isFinished ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(59,130,246,0.2)', padding: '10px', borderRadius: '12px' }}>
                <Activity size={24} color="#3b82f6" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: '#e1e0cc', margin: 0, lineHeight: 1 }}>
                  Voting Readiness Quiz
                </h3>
                <p style={{ color: 'rgba(225,224,204,0.5)', fontSize: '14px', margin: 0, fontFamily: 'Space Grotesk' }}>
                  Question {currentQuestion + 1} of {QUESTIONS.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '40px' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion) / QUESTIONS.length) * 100}%` }}
                style={{ height: '100%', background: '#3b82f6' }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ minHeight: '120px' }}
              >
                <h2 style={{ fontSize: '24px', fontFamily: 'Space Grotesk', color: '#fff', lineHeight: 1.4, margin: '0 0 32px 0' }}>
                  {QUESTIONS[currentQuestion].text}
                </h2>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn-outline" onClick={() => handleAnswer('yes')} style={{ padding: '16px', justifyContent: 'flex-start', border: '1px solid rgba(16,185,129,0.3)' }}>
                <Check size={18} color="#10b981" style={{ marginRight: '8px' }} /> Yes, absolutely
              </button>
              <button className="btn-outline" onClick={() => handleAnswer('notsure')} style={{ padding: '16px', justifyContent: 'flex-start', border: '1px solid rgba(245,158,11,0.3)' }}>
                <Activity size={18} color="#f59e0b" style={{ marginRight: '8px' }} /> Not sure
              </button>
              <button className="btn-outline" onClick={() => handleAnswer('no')} style={{ padding: '16px', justifyContent: 'flex-start', border: '1px solid rgba(239,68,68,0.3)' }}>
                <X size={18} color="#ef4444" style={{ marginRight: '8px' }} /> No, I haven't
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Shareable Card Ref */}
            <div
              ref={resultCardRef}
              style={{
                background: 'linear-gradient(145deg, #0f172a 0%, #0a0f1e 100%)',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid rgba(59,130,246,0.3)',
                textAlign: 'center',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: '#3b82f6', filter: 'blur(80px)', opacity: 0.3 }} />
              
              <h4 style={{ fontFamily: 'Bebas Neue', color: '#e1e0cc', fontSize: '24px', letterSpacing: '1px', margin: '0 0 8px 0' }}>ElectED</h4>
              <p style={{ fontFamily: 'Inter', color: 'rgba(225,224,204,0.6)', fontSize: '14px', margin: '0 0 24px 0' }}>Voting Readiness Score</p>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#3b82f6 ${score}%, transparent 0)`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '6px', background: '#0a0f1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '42px', color: '#fff', lineHeight: 1 }}>{score}%</span>
                </div>
              </div>
              
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', color: '#fff', margin: '24px 0 8px 0' }}>
                {score === 100 ? "You're a Civic Superstar!" : score > 70 ? "Almost There!" : "Let's Get You Ready!"}
              </h3>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontFamily: 'Inter', fontWeight: 600, color: '#e1e0cc', fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#f59e0b" /> Your Custom Action Plan
              </h4>
              
              {isGeneratingPlan ? (
                <div style={{ color: 'rgba(225,224,204,0.5)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
                  Gemini AI is analyzing your responses...
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {actionPlan.map((action, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: 'rgba(59,130,246,0.1)', padding: '12px 16px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                      <ArrowRight size={16} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: 'rgba(225,224,204,0.9)', lineHeight: 1.5, fontFamily: 'Inter' }}>{action}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" onClick={handleShare} style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Share2 size={18} /> Share Result
              </button>
              <button className="btn-outline" onClick={onClose} style={{ flex: 1, padding: '14px' }}>
                Done
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
