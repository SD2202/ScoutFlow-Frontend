import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import ChatPanel from './components/ChatPanel';
import InsightPanel from './components/InsightPanel';
import Dashboard from './components/Dashboard';
import CandidateProfile from './components/CandidateProfile';
import Login from './components/Login';
import Signup from './components/Signup';
import { recruitmentApi } from './services/api';
import { Users, Briefcase, MessageSquare, Zap, LayoutDashboard, LogOut, ChevronLeft } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('find'); // 'find', 'chat', 'dashboard'
  const [currentJobId, setCurrentJobId] = useState(null);
  const [shortlistStatus, setShortlistStatus] = useState({}); // { candidate_id: 'Selected' | 'Rejected' }

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await recruitmentApi.getCandidates();
      setCandidates(res.data);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleMatch = async (jdText) => {
    setLoading(true);
    try {
      // 1. Match candidates
      const res = await recruitmentApi.matchCandidates(jdText);
      setMatchResults(res.data);
      
      // 2. Save this job to backend for dashboard
      const jobRes = await recruitmentApi.saveJob({
        title: `Job Posting - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
        jd_text: jdText,
        created_at: new Date().toISOString(),
        is_active: true
      });
      setCurrentJobId(jobRes.data.job_id);
      
      // Reset shortlist status for new match
      setShortlistStatus({});

      // Automatically select the top match
      if (res.data.length > 0) {
        setSelectedCandidate(res.data[0]);
      }
    } catch (err) {
      console.error("Matching failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (candidateId, status) => {
    if (!currentJobId) return;
    
    // Try to find the match score if this candidate was just matched
    const matchData = matchResults.find(m => (m.candidate_id || m._id) === candidateId);
    const score = matchData ? matchData.final_score : null;
    
    try {
      await recruitmentApi.shortlistCandidate({
        job_id: currentJobId,
        candidate_id: candidateId,
        status: status,
        match_score: score
      });
      
      setShortlistStatus(prev => ({
        ...prev,
        [candidateId]: status
      }));
    } catch (err) {
      console.error("Failed to update candidate status", err);
    }
  };

  if (!user) {
    return authView === 'login' 
      ? <Login onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} /> 
      : <Signup onSignup={handleLogin} onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden text-text">
      {/* Single Persistent Left Sidebar */}
      {!['dashboard', 'profile'].includes(activeTab) && (
        <Sidebar 
          candidates={candidates} 
          selectedId={selectedCandidate?.candidate_id || selectedCandidate?._id}
          onSelect={setSelectedCandidate}
          matchResults={matchResults}
          shortlistStatus={shortlistStatus}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden border-x border-white/5">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-card/30 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="text-primary w-6 h-6 fill-primary" />
            <h1 className="text-xl font-bold tracking-tight">ScoutFlow <span className="text-primary">AI</span></h1>
          </div>
          
          <nav className="flex bg-background/50 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => setActiveTab('find')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'find' ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:text-text'}`}
            >
              <Zap size={14} /> Analyze & Match
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:text-text'}`}
            >
              <MessageSquare size={14} /> Outreach
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:text-text'}`}
            >
              <LayoutDashboard size={14} /> Dashboard
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-secondary">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="text-secondary hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex overflow-hidden relative">
            {activeTab === 'find' ? (
              <MainPanel 
                onMatch={handleMatch} 
                loading={loading} 
                results={matchResults} 
                selectedCandidate={selectedCandidate}
                onSelectCandidate={setSelectedCandidate}
                allCandidates={candidates}
              />
            ) : activeTab === 'chat' ? (
              <ChatPanel 
                candidate={selectedCandidate} 
                candidates={matchResults.length > 0 ? matchResults : candidates}
                onSelectCandidate={setSelectedCandidate}
              />
            ) : activeTab === 'profile' ? (
              <CandidateProfile 
                candidate={selectedCandidate} 
                onBack={() => setActiveTab('dashboard')} 
              />
            ) : (
              <Dashboard onSelectCandidate={(c) => {
                setSelectedCandidate(c);
                setActiveTab('profile');
              }} />
            )}
          </div>

          {/* Right Insight Panel */}
          {selectedCandidate && !['dashboard', 'profile'].includes(activeTab) && (
            <InsightPanel 
              candidate={selectedCandidate} 
              onShortlist={(status) => handleShortlist(selectedCandidate.candidate_id || selectedCandidate._id, status)}
              currentStatus={shortlistStatus[selectedCandidate.candidate_id || selectedCandidate._id]}
              onClose={() => setSelectedCandidate(null)}
              onViewProfile={() => setActiveTab('profile')}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
