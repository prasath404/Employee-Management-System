import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/employees';

const api = axios.create({
  baseURL: API_BASE_URL
});

const parseResponse = (response) => response.data;

export const EmployeeService = {
  list: () => api.get('').then(parseResponse),
  get: (id) => api.get(`/${id}`).then(parseResponse),
  create: (payload) => api.post('', payload).then(parseResponse),
  update: (id, payload) => api.put(`/${id}`, payload).then(parseResponse),
  remove: (id) => api.delete(`/${id}`)
};

export default EmployeeService;
