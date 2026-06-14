import api from './api';

const taskService = {
  getTasks: async (params = {}) => {
    const res = await api.get('/tasks', { params });
    return res.data;
  },

  getTask: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (data) => {
    const res = await api.post('/tasks', data);
    return res.data;
  },

  updateTask: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

  toggleStatus: async (id) => {
    const res = await api.patch(`/tasks/${id}/toggle`);
    return res.data;
  },
};

export default taskService;
