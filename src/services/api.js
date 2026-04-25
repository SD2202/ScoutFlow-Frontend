import axios from 'axios';

const api = axios.create();

const BASE = 'https://scoutflow-backend-zxq0.onrender.com/api/';

export const recruitmentApi = {
  parseJd: (jdText) => api.post(`${BASE}/parse-jd`, { jd_text: jdText }),
  getCandidates: () => api.get(`${BASE}/candidates`),
  matchCandidates: (jdText) => api.post(`${BASE}/match`, { jd_text: jdText }),
  simulateConversation: (profile, message) => api.post(`${BASE}/simulate-conversation`, { 
    candidate_profile: profile, 
    recruiter_message: message 
  }),
  scoreInterest: (history) => api.post(`${BASE}/score-interest`, history),
  login: (credentials) => api.post(`${BASE}/login`, credentials),
  signup: (userData) => api.post(`${BASE}/signup`, userData),
  saveJob: (jobData) => api.post(`${BASE}/jobs`, jobData),
  renameJob: (jobId, title) => api.patch(`${BASE}/jobs/${jobId}/rename`, { title }),
  toggleJobStatus: (id) => api.patch(`${BASE}/jobs/${id}/toggle-status`),
  deleteJob: (id) => api.delete(`${BASE}/jobs/${id}`),
  shortlistCandidate: (data) => api.post(`${BASE}/shortlist`, data),
  getDashboard: () => api.get(`${BASE}/dashboard`),
  getCandidateHistory: (id) => api.get(`${BASE}/candidates/${id}/history`),
  getCandidateSummary: (id) => api.get(`${BASE}/candidates/${id}/summary`),
};

export default api;
