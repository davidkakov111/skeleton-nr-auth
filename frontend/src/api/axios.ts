import axios from "axios";

export const BACKEND_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
export const api = axios.create({
  baseURL: BACKEND_API_URL,
  withCredentials: true, // This is crucial for sending cookies (JWT)
});
