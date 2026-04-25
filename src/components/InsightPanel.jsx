import React, { useState } from 'react';
import { 
   ShieldCheck, 
   AlertCircle, 
   MapPin, 
   IndianRupee, 
   Clock, 
   Eye, 
   EyeOff, 
   ChevronRight,
   Sparkles,
   Info,
   CheckCircle2,
   XCircle,
   X,
   Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InsightPanel = ({ candidate, onShortlist, currentStatus, onClose, onViewProfile }) => {
  const [showReasoning, setShowReasoning] = useState(false);
  
  if (!candidate) return null;
  
  const profile = candidate.profile || candidate;
  const evaluation = candidate.evaluation || null;

  return (
    <div className="w-[400px] bg-card/10 border-l border-white/5 h-full overflow-y-auto p-6 space-y-8 backdrop-blur-3xl shrink-0 relative">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all z-10"
      >
        <X size={20} />
      </button>

      {/* Profile Header */}
      <div>
        <div className="flex justify-between items-start mb-4 pr-8">
          <div className="flex flex-col gap-2">
            <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-primary/20 w-fit">
              Candidate Profile
            </div>
            <button 
              onClick={onViewProfile}
              className="flex items-center gap-1.5 text-[10px] font-bold text-secondary hover:text-primary transition-all group"
            >
              View Full Profile <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          {candidate.final_score && (
            <div className="text-right">
              <div className="text-3xl font-black text-accent drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                {Math.round(candidate.final_score)}
              </div>
              <div className="text-[8px] text-secondary font-bold uppercase tracking-tighter">AI Match Index</div>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{profile.name}</h2>
        <p className="text-sm text-primary font-bold mb-3">{profile.role}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Briefcase size={14} className="text-secondary" />
            <span className="font-semibold">{profile.current_company || "Tech Innovations Ltd."}</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-secondary">
            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5"><MapPin size={12} /> {profile.location}</span>
            <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/5"><IndianRupee size={12} /> {profile.current_ctc || profile.expected_salary || "₹12,00,000"} PA</span>
          </div>
        </div>

        {currentStatus && (
          <div className={`mt-4 p-3 rounded-xl border flex items-center gap-2 ${
            currentStatus === 'Selected' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-red-400/10 border-red-400/20 text-red-400'
          }`}>
            {currentStatus === 'Selected' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span className="text-xs font-bold uppercase tracking-wider">Candidate {currentStatus}</span>
          </div>
        )}
      </div>

      {/* AI Reasoning Toggle */}
      {evaluation && (
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" /> AI Insights
            </h3>
            <button 
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-[10px] flex items-center gap-1 text-secondary hover:text-text transition-all bg-white/5 px-2 py-1 rounded"
            >
              {showReasoning ? <EyeOff size={10} /> : <Eye size={10} />}
              {showReasoning ? 'Hide Reasoning' : 'View Reasoning'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                <ShieldCheck size={12} className="text-accent" /> Key Strengths
              </p>
              <div className="space-y-1">
                {evaluation.strengths?.map((s, i) => (
                  <div key={i} className="text-xs flex items-start gap-2 bg-accent/5 p-2 rounded-lg border border-accent/10">
                    <ChevronRight size={12} className="mt-0.5 text-accent shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertCircle size={12} className="text-red-400" /> Improvement Areas
              </p>
              <div className="space-y-1">
                {evaluation.weaknesses?.map((w, i) => (
                  <div key={i} className="text-xs flex items-start gap-2 bg-red-400/5 p-2 rounded-lg border border-red-400/10">
                    <ChevronRight size={12} className="mt-0.5 text-red-400 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showReasoning && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
              >
                <div className="bg-background/50 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Model Chain: Llama 3 → Reasoning</span>
                  </div>
                  <p className="text-xs leading-relaxed text-secondary italic">
                    "{evaluation.explanation}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Profile Details */}
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/50 p-4 rounded-2xl border border-white/5">
            <Clock size={16} className="text-secondary mb-2" />
            <div className="text-xs font-bold">{profile.experience}</div>
            <div className="text-[10px] text-secondary">Experience</div>
          </div>
          <div className="bg-card/50 p-4 rounded-2xl border border-white/5">
            <IndianRupee size={16} className="text-secondary mb-2" />
            <div className="text-xs font-bold">{profile.expected_salary}</div>
            <div className="text-[10px] text-secondary">Expected</div>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">Key Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs hover:border-primary/50 transition-all cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-8 flex gap-3">
        <button 
          onClick={() => onShortlist('Selected')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
            currentStatus === 'Selected' 
              ? 'bg-accent text-white shadow-accent/20' 
              : 'bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30'
          }`}
        >
          Shortlist
        </button>
        <button 
          onClick={() => onShortlist('Rejected')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
            currentStatus === 'Rejected'
              ? 'bg-red-400 text-white shadow-red-400/20'
              : 'bg-red-400/10 hover:bg-red-400/20 text-red-400 border border-red-400/20'
          }`}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default InsightPanel;
