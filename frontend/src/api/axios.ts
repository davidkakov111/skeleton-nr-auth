import axios from "axios";

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // This is crucial for sending cookies (JWT)
});