// lib/axios.ts
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PLAYER_API_URL,
  headers: {
    'Authorization': process.env.NEXT_PUBLIC_PLAYER_API_KEY || '',
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default API;
