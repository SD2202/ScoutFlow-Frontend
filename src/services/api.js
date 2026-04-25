import axios from 'axios';

// 🔥 AUTO SWITCH (LOCAL vs DEPLOYED)
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://scoutflow-backend-zxq0.onrender.com/api';

// 🔥 CREATE AXIOS INSTANCE (IMPORTANT)
const api = axios.create({
  baseURL: BASE_URL.replace(/\/+$/, ''), // remove trailing slash
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔥 CENTRALIZED API METHODS
export const recruitmentApi = {
  // JD Parsing
  parseJd: (jdText) => api.post('/parse-jd', { jd_text: jdText }),

  // Candidates
  getCandidates: () => api.get('/candidates'),

  // Matching
  matchCandidates: (jdText) =>
    api.post('/match', { jd_text: jdText }),

  // Conversation
  simulateConversation: (profile, message) =>
    api.post('/simulate-conversation', {
      candidate_profile: profile,
      recruiter_message: message,
    }),

  // Interest scoring
  scoreInterest: (history) =>
    api.post('/score-interest', history),

  // Auth
  login: (credentials) => api.post('/login', credentials),
  signup: (userData) => api.post('/signup', userData),

  // Jobs
  saveJob: (jobData) => api.post('/jobs', jobData),
  renameJob: (jobId, title) =>
    api.patch(`/jobs/${jobId}/rename`, { title }),
  toggleJobStatus: (id) =>
    api.patch(`/jobs/${id}/toggle-status`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),

  // Shortlisting
  shortlistCandidate: (data) =>
    api.post('/shortlist', data),

  // Dashboard
  getDashboard: () => api.get('/dashboard'),

  // Candidate details
  getCandidateHistory: (id) =>
    api.get(`/candidates/${id}/history`),

  getCandidateSummary: (id) =>
    api.get(`/candidates/${id}/summary`),
};

export default api;
