import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainPanel = ({ onMatch, loading, results, selectedCandidate, onSelectCandidate, allCandidates }) => {
  const [jdText, setJdText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jdText.trim()) {
      onMatch(jdText);
    }
  };

  const displayCandidates = results.length > 0 ? results : (jdText.trim() === '' ? allCandidates : []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="p-8 pb-4">
        <div className="max-w-3xl border border-white/5 bg-card/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="text-primary w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Find Best Candidates</h3>
              <p className="text-xs text-secondary">Paste a Job Description and let AI find your perfect match.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <textarea 
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste Job Description here..."
                className="w-full h-40 bg-background/50 border border-white/10 rounded-xl p-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none shadow-inner"
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={loading || !jdText.trim()}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {loading ? "Analyzing Skills..." : "Find Candidates"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <AnimatePresence>
          {results.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-secondary flex items-center gap-2">
                  <Brain size={14} className="text-primary" /> AI Ranking Results
                </h3>
                <div className="text-[10px] text-secondary flex items-center gap-4">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-accent"></div> Matching</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> Analysis</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.slice(0, 10).map((cand, idx) => (
                  <motion.div 
                    key={cand.candidate_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onSelectCandidate(cand)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedCandidate?.candidate_id === cand.candidate_id
                        ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                        : 'bg-card/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{cand.name}</h4>
                        <p className="text-xs text-secondary">{cand.profile.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary">{Math.round(cand.final_score)}%</div>
                        <p className="text-[10px] text-secondary uppercase font-bold tracking-tighter">Match Score</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cand.profile.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="text-[10px] bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-[10px] text-accent font-medium">
                          <CheckCircle2 size={12} /> {cand.evaluation.strengths.length} Strengths
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                          <XCircle size={12} /> {cand.evaluation.weaknesses.length} Gaps
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-secondary italic">
                        {cand.evaluation.recommendation_status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-20">
              <Sparkles size={64} className="mb-4 text-secondary" />
              <h2 className="text-2xl font-light">Your candidate results will appear here</h2>
              <p className="text-sm mt-2">Paste a job description to begin the AI matching process</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainPanel;
