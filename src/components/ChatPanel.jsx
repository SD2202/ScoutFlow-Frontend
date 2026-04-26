import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles, TrendingUp, MessageSquare, ChevronRight } from 'lucide-react';
import { recruitmentApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = ({ candidate, candidates, onSelectCandidate }) => {
  const [messages, setMessages] = useState({}); // { candidateId: [messages] }
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interestScores, setInterestScores] = useState({}); // { candidateId: score }
  const scrollRef = useRef(null);

  const currentCandidateId = candidate?.candidate_id || candidate?._id;
  const currentMessages = currentCandidateId ? (messages[currentCandidateId] || []) : [];
  const currentInterestScore = currentCandidateId ? interestScores[currentCandidateId] : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !candidate) return;

    const userMessage = { role: 'recruiter', content: input };
    const updatedMessages = [...currentMessages, userMessage];
    
    setMessages(prev => ({
      ...prev,
      [currentCandidateId]: updatedMessages
    }));
    setInput('');
    setIsTyping(true);

    try {
      const profile = candidate.profile || candidate;
      const res = await recruitmentApi.simulateConversation(currentCandidateId, profile, input);
      
      setTimeout(() => {
        const botMessage = { 
          role: 'candidate', 
          content: res.data.response,
          tone: res.data.tone,
          interest: res.data.interest_level
        };
        const finalMessages = [...updatedMessages, botMessage];
        
        setMessages(prev => ({
          ...prev,
          [currentCandidateId]: finalMessages
        }));
        setIsTyping(false);
        
        updateInterestScore(currentCandidateId, finalMessages);
      }, 1000);

    } catch (err) {
      console.error("Simulation failed", err);
      setIsTyping(false);
    }
  };

  const updateInterestScore = async (id, history) => {
    try {
      const res = await recruitmentApi.scoreInterest(history.map(m => ({ 
        role: m.role, 
        content: m.content 
      })));
      setInterestScores(prev => ({
        ...prev,
        [id]: res.data
      }));
    } catch (err) {
      console.error("Failed to score interest", err);
    }
  };

  if (!candidate) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-8 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-6 animate-bounce">
          <MessageSquare size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Ready for Outreach?</h2>
        <p className="text-slate-400 max-w-md mb-8">Select a candidate from your matches to start a simulated conversation and gauge their interest level.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {candidates && candidates.map((c, idx) => (
            <button 
              key={idx}
              onClick={() => onSelectCandidate(c)}
              className="flex items-center gap-4 p-4 bg-card/40 border border-white/5 rounded-2xl hover:border-primary/50 transition-all text-left group shrink-0"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                <User size={18} className="text-slate-400 group-hover:text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{c.profile?.name || c.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{c.profile?.role || c.role}</p>
              </div>
              <ChevronRight size={16} className="text-slate-600 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      {/* Selection Header for switching between shortlisted */}
      <div className="h-14 border-b border-white/5 bg-card/20 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
            <User size={14} />
          </div>
          <div>
            <span className="text-sm font-bold text-white">{candidate.profile?.name || candidate.name}</span>
            <span className="ml-2 text-[10px] text-slate-500 uppercase">{candidate.profile?.role || candidate.role}</span>
          </div>
        </div>
      </div>

      {/* Interest Progress Bar */}
      {currentInterestScore && (
        <div className="absolute top-[56px] left-0 right-0 h-1 bg-white/5 z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${currentInterestScore.interest_score}%` }}
            className={`h-full ${currentInterestScore.interest_score > 70 ? 'bg-accent' : currentInterestScore.interest_score > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
          />
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {currentMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 mt-[-50px]">
            <Sparkles size={48} className="mb-4" />
            <p className="text-xl font-light">Start a conversation with {candidate.profile?.name || candidate.name}</p>
            <p className="text-sm">Simulate outreach and gauge interest level using AI</p>
          </div>
        )}

        {currentMessages.map((m, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: m.role === 'recruiter' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${m.role === 'recruiter' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] flex gap-3 ${m.role === 'recruiter' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                m.role === 'recruiter' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-accent/20 border-accent/30 text-accent'
              }`}>
                {m.role === 'recruiter' ? <Bot size={14} /> : <User size={14} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${
                m.role === 'recruiter' 
                  ? 'bg-card border border-white/5 rounded-tl-none' 
                  : 'bg-primary text-white rounded-tr-none shadow-lg'
              }`}>
                {m.content}
                {m.tone && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Tone: {m.tone}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-end">
            <div className="flex flex-row-reverse gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 text-accent flex items-center justify-center">
                <User size={14} />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tr-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-xs text-secondary italic">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-card/10">
        <form onSubmit={handleSend} className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${candidate.profile?.name || candidate.name}...`}
            className="w-full bg-card/50 border border-white/10 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-white"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
        
        {currentInterestScore && (
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs text-secondary">
              <TrendingUp size={14} className="text-accent" />
              Predicted Interest: <span className="font-bold text-white">{currentInterestScore.status} ({currentInterestScore.interest_score}%)</span>
            </div>
            <p className="text-[10px] text-slate-500 italic max-w-[50%] truncate text-right">
              "{currentInterestScore.explanation}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
