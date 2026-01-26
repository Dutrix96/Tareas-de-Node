import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 15000,
});

// Interceptor: mete x-token automaticamente si existe en localStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["x-token"] = token;
  }
  return config;
});

export const withToken = (token) => ({
  headers: {
    "x-token": token,
  },
});