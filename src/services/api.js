import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (phone, password, role, secondPassword = '') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (phone === '13800138000' && password === '123456') {
          if (role === 'parent') {
            if (secondPassword === '654321') {
              resolve({
                success: true,
                data: {
                  id: 'parent001',
                  name: '张家长',
                  role: 'parent',
                  phone: '13800138000',
                  token: 'mock-token-parent',
                  children: ['child001', 'child002']
                }
              });
            } else {
              resolve({ success: false, message: '家长二级密码错误' });
            }
          } else {
            resolve({
              success: true,
              data: {
                id: 'child001',
                name: '小明',
                role: 'child',
                parentId: 'parent001',
                age: 8,
                grade: '二年级',
                hobby: '画画,阅读',
                phone: '13800138000',
                token: 'mock-token-child'
              }
            });
          }
        } else {
          resolve({ success: false, message: '手机号或密码错误' });
        }
      }, 500);
    });
  },
  
  register: (data) => api.post('/users/register', data),
};

export const taskAPI = {
  getTasks: (childId) => api.get('/tasks', { params: { childId } }),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const checkinAPI = {
  getCheckins: (childId) => api.get('/checkins', { params: { childId } }),
  createCheckin: (data) => api.post('/checkins', data),
  reviewCheckin: (id, data) => api.put(`/checkins/${id}/review`, data),
};

export const pointsAPI = {
  getBalance: (childId) => api.get('/points/balance', { params: { childId } }),
  getHistory: (childId) => api.get('/points/history', { params: { childId } }),
};

export const giftAPI = {
  getGifts: () => api.get('/gifts'),
  exchange: (data) => api.post('/exchanges', data),
};

export const textbookAPI = {
  getTextbooks: (parentId) => api.get('/textbooks', { params: { parentId } }),
  createTextbook: (data) => api.post('/textbooks', data),
  updateTextbook: (id, data) => api.put(`/textbooks/${id}`, data),
  deleteTextbook: (id) => api.delete(`/textbooks/${id}`),
  toggleStatus: (id) => api.put(`/textbooks/${id}/status`),
};

export const reportAPI = {
  getDaily: (childId) => api.get('/reports/daily', { params: { childId } }),
  getWeekly: (childId) => api.get('/reports/weekly', { params: { childId } }),
  getMonthly: (childId) => api.get('/reports/monthly', { params: { childId } }),
};

export const aiAPI = {
  grade: (data) => api.post('/ai/grade', data),
  generateQuestions: (data) => api.post('/ai/questions', data),
  generateTask: (data) => api.post('/ai/generate-task', data),
  generateProfile: (data) => api.post('/ai/profile', data),
};

export default api;