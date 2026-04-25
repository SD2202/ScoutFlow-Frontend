import axios from 'axios';

const API_BASE_URL = 'https://scoutflow-backend-zxq0.onrender.com/api/'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const recruitmentApi = {
  parseJd: (jdText) => api.post('/api/parse-jd', { jd_text: jdText }),
  getCandidates: () => api.get('/api/candidates'),
  matchCandidates: (jdText) => api.post('/api/match', { jd_text: jdText }),
  simulateConversation: (profile, message) => api.post('/api/simulate-conversation', { 
    candidate_profile: profile, 
    recruiter_message: message 
  }),
  scoreInterest: (history) => api.post('/api/score-interest', history),
  login: (credentials) => api.post('/api/login', credentials),
  signup: (userData) => api.post('/api/signup', userData),
  saveJob: (jobData) => api.post('/api/jobs', jobData),
  renameJob: (jobId, title) => api.patch(`/api/jobs/${jobId}/rename`, { title }),
  toggleJobStatus: (id) => api.patch(`/api/jobs/${id}/toggle-status`),
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),
  shortlistCandidate: (data) => api.post('/api/shortlist', data),
  getDashboard: () => api.get('/api/dashboard'),
  getCandidateHistory: (id) => api.get(`/api/candidates/${id}/history`),
  getCandidateSummary: (id) => api.get(`/api/candidates/${id}/summary`),
};

export default api;
