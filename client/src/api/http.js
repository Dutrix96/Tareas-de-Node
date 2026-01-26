import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 15000,
});

export const withToken = (token) => ({
  headers: {
    "x-token": token,
  },
});