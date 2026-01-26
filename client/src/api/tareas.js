import { http, withToken } from "./http.js";

export const apiContadorSinAsignar = async (token) => {
  const { data } = await http.post("/tareas/contador/sin-asignar", {}, withToken(token));
  return data;
};

export const apiTareasSinAsignar = async (token) => {
  const { data } = await http.post("/tareas/sin-asignar", {}, withToken(token));
  return data;
};

export const apiCogerTarea = async (token, tareaId) => {
  const { data } = await http.post(`/tareas/coger/${tareaId}`, {}, withToken(token));
  return data;
};

export const apiSoltarTarea = async (token, tareaId) => {
  const { data } = await http.post(`/tareas/soltar/${tareaId}`, {}, withToken(token));
  return data;
};

export const apiAvanzarTarea = async (token, tareaId) => {
  const { data } = await http.post(`/tareas/avanzar/${tareaId}`, {}, withToken(token));
  return data;
};