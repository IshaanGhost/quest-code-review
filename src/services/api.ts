
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string[];
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
}

export interface Session {
  id: string;
  userId: string;
  questionId: string;
  code: string;
  language: string;
  score: number;
  feedback: string;
  timestamp: Date;
  duration: number;
}

export const apiService = {
  // Questions
  getQuestions: () => api.get<Question[]>('/questions'),
  getQuestion: (id: string) => api.get<Question>(`/questions/${id}`),
  createQuestion: (question: Omit<Question, 'id'>) => api.post<Question>('/questions', question),
  updateQuestion: (id: string, question: Partial<Question>) => api.put<Question>(`/questions/${id}`, question),
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),

  // Sessions
  getUserSessions: (userId: string) => api.get<Session[]>(`/sessions/user/${userId}`),
  submitCode: (questionId: string, code: string, language: string) => 
    api.post<{ score: number; feedback: string }>('/sessions/submit', { questionId, code, language }),

  // Admin
  getAllSessions: () => api.get<Session[]>('/sessions'),
  getUserStats: () => api.get('/stats/users'),
};
