import React, { useState } from 'react';
import { Zap, Lock, User, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { recruitmentApi } from '../services/api';
import logo from "../assets/logo.png";
const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await recruitmentApi.signup(formData);
      onSignup(formData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0c10] overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 relative"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 mb-4">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Join <span className="text-accent">ScoutFlow AI</span></h1>
            <p className="text-slate-400 text-sm mt-2">Create your recruiter account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" size={16} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                  placeholder="Your Full Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" size={16} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" size={16} />
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" size={16} />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-background/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && <p className="text-[10px] text-red-400 text-center font-bold">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-2 group mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={onSwitchToLogin}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Already have an account? <span className="text-accent font-bold">Sign In</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
