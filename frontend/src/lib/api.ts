// src/lib/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE as string;

// If you use axios, you can also export a pre-configured instance:
import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});
