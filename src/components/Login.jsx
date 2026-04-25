import React, { useState } from 'react';
import { recruitmentApi } from '../services/api';
import { Zap, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await recruitmentApi.login({ username, password });
      onLogin(res.data.user);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 relative"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
              <Zap className="text-white w-8 h-8 fill-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">ScoutFlow <span className="text-primary">AI</span></h1>
            <p className="text-slate-400 text-sm mt-2">Sign in to access your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-400 font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-4 text-center">
            <button 
              onClick={onSwitchToSignup}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Don't have an account? <span className="text-primary font-bold">Sign Up</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
              Secured by Enterprise Shield AI
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
