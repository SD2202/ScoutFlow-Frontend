import axios from 'axios';

const API_BASE_URL = 'https://scoutflow-backend-zxq0.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const recruitmentApi = {
  parseJd: (jdText) => api.post('/parse-jd', { jd_text: jdText }),
  getCandidates: () => api.get('/candidates'),
  matchCandidates: (jdText) => api.post('/match', { jd_text: jdText }),
  simulateConversation: (profile, message) => api.post('/simulate-conversation', { 
    candidate_profile: profile, 
    recruiter_message: message 
  }),
  scoreInterest: (history) => api.post('/score-interest', history),
  login: (credentials) => api.post('/login', credentials),
  signup: (userData) => api.post('/signup', userData),
  saveJob: (jobData) => api.post('/jobs', jobData),
  renameJob: (jobId, title) => api.patch(`/jobs/${jobId}/rename`, { title }),
  toggleJobStatus: (id) => api.patch(`/jobs/${id}/toggle-status`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  shortlistCandidate: (data) => api.post('/shortlist', data),
  getDashboard: () => api.get('/dashboard'),
  getCandidateHistory: (id) => api.get(`/candidates/${id}/history`),
  getCandidateSummary: (id) => api.get(`/candidates/${id}/summary`),
};

export default api;
