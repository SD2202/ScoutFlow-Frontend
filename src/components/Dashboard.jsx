import React, { useState, useEffect } from 'react';
import { recruitmentApi } from '../services/api';
import { Briefcase, User, CheckCircle2, XCircle, Clock, ChevronRight, Search, Zap, Plus, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ onSelectCandidate }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('active'); // 'active' or 'inactive'
  const [editingJobId, setEditingJobId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState({ title: '', jd: '', is_active: true });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await recruitmentApi.getDashboard();
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await recruitmentApi.saveJob({
        title: createData.title,
        jd_text: createData.jd,
        is_active: createData.is_active,
        created_at: new Date().toISOString()
      });
      setShowCreateModal(false);
      setCreateData({ title: '', jd: '', is_active: true });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to create job", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job and all associated candidate data?")) return;
    try {
      await recruitmentApi.deleteJob(jobId);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const handleToggleStatus = async (jobId) => {
    try {
      await recruitmentApi.toggleJobStatus(jobId);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to toggle job status", err);
    }
  };

  const handleRename = async (jobId) => {
    if (!newTitle.trim()) return;
    try {
      await recruitmentApi.renameJob(jobId, newTitle);
      setEditingJobId(null);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to rename job", err);
    }
  };

  const startEditing = (job) => {
    setEditingJobId(job._id);
    setNewTitle(job.title);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.jd_text?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'active' ? job.is_active : !job.is_active;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Recruitment Dashboard</h1>
            <p className="text-slate-400 mt-1">Manage your active job postings and candidate pipelines</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} /> Create New Job
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="bg-card/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none w-64 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex bg-card/30 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
            <button 
              onClick={() => setActiveFilter('active')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'active' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Active Jobs ({jobs.filter(j => j.is_active).length})
            </button>
            <button 
              onClick={() => setActiveFilter('inactive')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeFilter === 'inactive' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Inactive ({jobs.filter(j => !j.is_active).length})
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">
                {jobs.reduce((acc, job) => acc + job.shortlisted_candidates.filter(c => c.status === 'Selected').length, 0)}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Selected</div>
            </div>
            <div className="w-px h-8 bg-white/5"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-400">
                {jobs.reduce((acc, job) => acc + job.shortlisted_candidates.filter(c => c.status === 'Rejected').length, 0)}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Rejected</div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card/20 border rounded-3xl overflow-hidden transition-all ${job.is_active ? 'border-white/5 shadow-xl' : 'border-white/5 opacity-75'}`}
            >
              <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2.5 rounded-xl ${job.is_active ? 'bg-primary/20 text-primary' : 'bg-slate-700/50 text-slate-400'}`}>
                    <Briefcase size={20} />
                  </div>
                  {editingJobId === job._id ? (
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <input 
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="bg-background/50 border border-primary/50 rounded-lg px-3 py-1.5 text-sm text-white w-full outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(job._id)}
                      />
                      <button onClick={() => handleRename(job._id)} className="p-1.5 bg-accent/20 text-accent rounded-lg"><CheckCircle2 size={16} /></button>
                      <button onClick={() => setEditingJobId(null)} className="p-1.5 bg-red-400/20 text-red-400 rounded-lg"><XCircle size={16} /></button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg text-white">{job.title || "Untitled Job"}</h3>
                        <div className={`w-2 h-2 rounded-full ${job.is_active ? 'bg-accent' : 'bg-slate-500'}`}></div>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-md">{job.jd_text?.substring(0, 80)}...</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEditing(job)}
                      className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                      title="Rename Job"
                    >
                      <ChevronRight size={18} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(job._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-lg ${
                        job.is_active 
                          ? 'border-red-400/30 text-red-400 hover:bg-red-400/10 shadow-red-400/5' 
                          : 'border-accent/30 text-accent hover:bg-accent/10 shadow-accent/5'
                      }`}
                    >
                      {job.is_active ? 'Make Inactive' : 'Make Active'}
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2.5 bg-red-400/10 text-red-400 hover:bg-red-400/20 rounded-xl transition-all border border-red-400/20"
                      title="Delete Job"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="w-px h-6 bg-white/5 mx-2"></div>
                  
                  <span className="text-[10px] font-bold bg-white/5 px-2.5 py-1 rounded-full text-slate-400 uppercase tracking-widest border border-white/5">
                    {job.shortlisted_candidates.length} MATCHES
                  </span>
                </div>
              </div>

              <div className="p-6">
                {job.shortlisted_candidates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {job.shortlisted_candidates.map((match, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => onSelectCandidate(match.candidate)}
                        className="bg-background/50 border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-primary/30 transition-all cursor-pointer hover:bg-white/5"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                          <User size={18} className="text-secondary group-hover:text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{match.candidate.name}</p>
                              {match.match_score !== undefined && match.match_score !== null && (
                                <span className="shrink-0 text-[10px] font-black bg-accent text-background px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                                  {Math.round(match.match_score)}%
                                </span>
                              )}
                            </div>
                            {match.status === 'Selected' ? (
                              <CheckCircle2 size={14} className="text-accent" />
                            ) : match.status === 'Rejected' ? (
                              <XCircle size={14} className="text-red-400" />
                            ) : (
                              <Clock size={14} className="text-secondary" />
                            )}
                          </div>
                          <p className="text-[10px] text-secondary truncate">{match.candidate.role}</p>
                        </div>
                        <ChevronRight size={14} className="text-secondary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-secondary italic">No candidates shortlisted yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredJobs.length === 0 && !loading && (
            <div className="text-center py-20 bg-card/10 rounded-3xl border border-white/5 border-dashed">
              <Briefcase size={40} className="mx-auto text-secondary/30 mb-4" />
              <p className="text-secondary">No job postings found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Job Posting</h2>
                    <p className="text-xs text-slate-400">Add a new role to your recruitment pipeline</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                  <input 
                    type="text"
                    value={createData.title}
                    onChange={(e) => setCreateData({...createData, title: e.target.value})}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Job Description</label>
                  <textarea 
                    value={createData.jd}
                    onChange={(e) => setCreateData({...createData, jd: e.target.value})}
                    placeholder="Paste the requirements and responsibilities here..."
                    className="w-full h-40 bg-background/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${createData.is_active ? 'bg-accent shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-500'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-white">Active Status</p>
                      <p className="text-[10px] text-slate-500">Should this job be visible to candidates immediately?</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setCreateData({...createData, is_active: !createData.is_active})}
                    className={`w-12 h-6 rounded-full relative transition-all ${createData.is_active ? 'bg-primary' : 'bg-slate-700'}`}
                  >
                    <motion.div 
                      animate={{ x: createData.is_active ? 26 : 2 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all"
                  >
                    Create Job Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
