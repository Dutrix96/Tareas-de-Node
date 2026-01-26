import Tarea from "../models/Task.js";

//aqui empieza lo del admin

const crear = async ({ descripcion, duracion, dificultad }, adminId) => {
  if (!descripcion || duracion === undefined || !dificultad) {
    const e = new Error("Faltan datos");
    e.statusCode = 400;
    throw e;
  }

  const tarea = await Tarea.create({
    descripcion,
    duracion,
    dificultad,
    estado: "por_hacer",
    asignadaA: null,
    creadaPor: adminId,
  });

  return tarea;
};

const listarTodas = async () => {
  return Tarea.find().populate("asignadaA", "name email");
};

const editar = async (id, datos) => {
  const tarea = await Tarea.findById(id);
  if (!tarea) {
    const e = new Error("Tarea no encontrada");
    e.statusCode = 404;
    throw e;
  }

  if (datos.descripcion !== undefined) tarea.descripcion = datos.descripcion;
  if (datos.duracion !== undefined) tarea.duracion = datos.duracion;
  if (datos.dificultad !== undefined) tarea.dificultad = datos.dificultad;
  if (datos.estado !== undefined) tarea.estado = datos.estado;

  await tarea.save();
  return tarea;
};

const eliminar = async (id) => {
  const tarea = await Tarea.findById(id);
  if (!tarea) {
    const e = new Error("Tarea no encontrada");
    e.statusCode = 404;
    throw e;
  }

  await Tarea.deleteOne({ _id: id });
  return true;
};

//aqui empieza lo del usuario

const listarSinAsignar = async () => {
  return Tarea.find({ asignadaA: null });
};

const cogerTarea = async (tareaId, usuarioId, redis) => {
  const tarea = await Tarea.findById(tareaId);
  if (!tarea) {
    const e = new Error("Tarea no encontrada");
    e.statusCode = 404;
    throw e;
  }

  if (tarea.asignadaA) {
    const e = new Error("La tarea ya esta asignada");
    e.statusCode = 400;
    throw e;
  }

  tarea.asignadaA = usuarioId;
  await tarea.save();

  if (redis) {
    await redis.decr("tareas:sin_asignar:contador");
  }

  return tarea;
};

const soltarTarea = async (tareaId, usuarioId, redis) => {
  const tarea = await Tarea.findById(tareaId);
  if (!tarea) {
    const e = new Error("Tarea no encontrada");
    e.statusCode = 404;
    throw e;
  }

  if (!tarea.asignadaA || tarea.asignadaA.toString() !== usuarioId) {
    const e = new Error("No puedes soltar esta tarea");
    e.statusCode = 403;
    throw e;
  }

  tarea.asignadaA = null;
  tarea.estado = "por_hacer";
  await tarea.save();

  if (redis) {
    await redis.incr("tareas:sin_asignar:contador");
  }

  return tarea;
};

const avanzarEstado = async (tareaId, usuarioId) => {
  const tarea = await Tarea.findById(tareaId);
  if (!tarea) {
    const e = new Error("Tarea no encontrada");
    e.statusCode = 404;
    throw e;
  }

  if (!tarea.asignadaA || tarea.asignadaA.toString() !== usuarioId) {
    const e = new Error("No puedes modificar esta tarea");
    e.statusCode = 403;
    throw e;
  }

  if (tarea.estado === "por_hacer") tarea.estado = "haciendo";
  else if (tarea.estado === "haciendo") tarea.estado = "hecha";

  await tarea.save();
  return tarea;
};

export default {
  crear,
  listarTodas,
  editar,
  eliminar,
  listarSinAsignar,
  cogerTarea,
  soltarTarea,
  avanzarEstado,
};