import React from 'react';
import { User, Award, MapPin, CheckCircle2, XCircle, IndianRupee } from 'lucide-react';

const Sidebar = ({ candidates, selectedId, onSelect, matchResults, shortlistStatus }) => {
  return (
    <div className="w-80 flex flex-col bg-background/50 border-r border-white/5 h-full overflow-hidden shrink-0">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary">Talent Pool</h2>
        <span className="bg-white/5 text-xs px-2 py-1 rounded-full">{candidates.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {candidates.map((cand) => {
          const id = cand.candidate_id || cand._id;
          const isActive = selectedId === id;
          const profile = cand.profile || cand;
          const status = shortlistStatus ? shortlistStatus[id] : null;
          
          // Look for match score in matchResults
          const matchData = matchResults?.find(m => (m.candidate_id || m._id) === id);
          const score = matchData?.final_score;
          
          return (
            <div 
              key={id}
              onClick={() => onSelect(cand)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                isActive 
                  ? 'bg-primary/20 border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'bg-card/40 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                    isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-background border-white/10 group-hover:border-white/20'
                  }`}>
                    <User size={18} />
                  </div>
                  {status && (
                    <div className="absolute -bottom-1 -right-1">
                      {status === 'Selected' ? (
                        <CheckCircle2 size={14} className="text-accent fill-background" />
                      ) : (
                        <XCircle size={14} className="text-red-400 fill-background" />
                      )}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-text'}`}>
                      {profile.name}
                    </p>
                    {score && (
                      <span className="text-[10px] font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded border border-accent/30 shrink-0">
                        {Math.round(score)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary truncate mt-0.5">{profile.role}</p>
                  
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-secondary">
                    <span className="flex items-center gap-1 shrink-0">
                      <Award size={10} /> {profile.experience}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={10} /> {profile.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
