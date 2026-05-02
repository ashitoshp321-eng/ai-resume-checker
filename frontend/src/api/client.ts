import axios from 'axios';

// Get base URL from environment or default to local backend
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL,
});
