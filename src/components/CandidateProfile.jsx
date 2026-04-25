import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Award, 
  ChevronLeft, ExternalLink, Calendar, 
  Briefcase, CheckCircle2, XCircle, Clock, Sparkles, IndianRupee
} from 'lucide-react';
import { recruitmentApi } from '../services/api';
import { motion } from 'framer-motion';

const CandidateProfile = ({ candidate, onBack }) => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);

  if (!candidate) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-secondary text-sm">Loading Candidate Profile...</p>
        </div>
      </div>
    );
  }

  const profile = candidate.profile || candidate;
  const candidateId = candidate._id || candidate.candidate_id;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await recruitmentApi.getCandidateHistory(candidateId);
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch candidate history", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const data = await recruitmentApi.getCandidateSummary(candidateId);
        setSummary(data.summary || "No summary available.");
      } catch (err) {
        console.error("Failed to fetch candidate summary", err);
        setSummary("AI was unable to generate a summary at this time.");
      } finally {
        setSummaryLoading(false);
      }
    };

    if (candidateId) {
      fetchHistory();
      fetchSummary();
    }
  }, [candidateId]);

  return (
    <div className="flex-1 bg-background h-full overflow-y-auto custom-scrollbar">
      {/* Navigation Header */}
      <div className="sticky top-0 z-30 px-8 py-4 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-all">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm font-bold">Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Candidate Profile</span>
           <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-10">
        {/* Profile Hero */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-white/10 flex items-center justify-center text-white shrink-0 shadow-2xl"
          >
            <User size={64} />
          </motion.div>
          
          <div className="flex-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl font-black text-white tracking-tight">{profile.name || "Candidate"}</h1>
              <div className="flex flex-col gap-1 mt-2">
                <p className="text-2xl text-primary font-bold">{profile.role || "Professional Role"}</p>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Briefcase size={16} className="text-secondary" />
                  <span>Currently at <span className="text-white">{profile.current_company || "Confidential Company"}</span></span>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-slate-400">
                <IndianRupee size={18} className="text-secondary" />
                <span className="text-sm font-bold text-white">{profile.current_ctc || profile.expected_salary || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin size={18} className="text-secondary" />
                <span className="text-sm font-medium">{profile.location || "Location Unknown"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Award size={18} className="text-secondary" />
                <span className="text-sm font-medium">{profile.experience || "N/A"} Experience</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={18} className="text-secondary" />
                <span className="text-sm font-medium">Available Now</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
                Download Resume <ExternalLink size={16} />
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-2xl text-sm font-bold border border-white/5 transition-all">
                Send Email
              </button>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} className="text-primary" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} />
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">AI-Generated Professional Summary</h3>
            </div>
            {summaryLoading ? (
              <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                <div className="w-4 h-4 bg-primary/20 rounded-full"></div>
                <p className="text-sm italic">ScoutFlow AI is generating a professional summary...</p>
              </div>
            ) : (
              <p className="text-xl text-slate-200 font-medium leading-relaxed max-w-4xl italic">
                "{summary}"
              </p>
            )}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Skills */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Core Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {profile.skills?.map(skill => (
                  <span key={skill} className="bg-card/50 border border-white/5 px-4 py-2 rounded-xl text-sm text-slate-300 font-medium hover:border-primary/30 transition-all cursor-default">
                    {skill}
                  </span>
                ))}
                {(!profile.skills || profile.skills.length === 0) && (
                   <p className="text-sm text-slate-500 italic">No skills listed for this candidate.</p>
                )}
              </div>
            </section>

            {/* Application History */}
            <section className="space-y-4">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Recruitment History</h3>
              <div className="bg-card/30 border border-white/5 rounded-[2rem] overflow-hidden">
                {loading ? (
                  <div className="p-10 text-center text-slate-500">Loading history...</div>
                ) : history.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {history.map((entry, idx) => (
                      <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${entry.status === 'Selected' ? 'bg-accent/10 text-accent' : entry.status === 'Rejected' ? 'bg-red-400/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-primary transition-colors">{entry.job_title || "Job Posting"}</p>
                            <p className="text-xs text-slate-500">Applied on {entry.applied_at || "N/A"}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          entry.status === 'Selected' 
                            ? 'bg-accent/10 border-accent/20 text-accent' 
                            : entry.status === 'Rejected' 
                              ? 'bg-red-400/10 border-red-400/20 text-red-400' 
                              : 'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                          {entry.status === 'Selected' ? <CheckCircle2 size={12} /> : entry.status === 'Rejected' ? <XCircle size={12} /> : <Clock size={12} />}
                          {entry.status || "In Progress"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-slate-500 italic">No previous applications found in ScoutFlow AI</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 space-y-6">
               <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Candidate Analytics</h4>
               
               <div className="space-y-1">
                 <div className="text-4xl font-black text-white">{history.filter(h => h.status === 'Selected').length}</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Selections</div>
               </div>

               <div className="space-y-1 pt-4 border-t border-primary/10">
                 <div className="text-4xl font-black text-white">{history.filter(h => h.status === 'Rejected').length}</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Rejections</div>
               </div>

               <div className="pt-6">
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-accent" 
                     style={{ width: `${(history.filter(h => h.status === 'Selected').length / (history.length || 1)) * 100}%` }}
                   />
                 </div>
                 <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter">Success Rate</p>
               </div>
            </div>

            <div className="bg-card/30 border border-white/5 rounded-[2.5rem] p-8">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Details</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-3 text-slate-300">
                   <Mail size={16} className="text-secondary" />
                   <span className="text-sm truncate">{(profile.name || "candidate").toLowerCase().replace(/\s+/g, '.')}@example.com</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-300">
                   <Phone size={16} className="text-secondary" />
                   <span className="text-sm">+91 98765 43210</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
