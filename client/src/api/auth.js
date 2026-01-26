import { http } from "./http.js";

export const apiRegister = async (name, email, password) => {
  const { data } = await http.post("/auth/register", { name, email, password });
  return data;
};

export const apiLogin = async (email, password) => {
  const { data } = await http.post("/auth/login", { email, password });
  return data;
};