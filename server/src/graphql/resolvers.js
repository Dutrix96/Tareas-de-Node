import Tarea from "../models/Task.js";
import User from "../models/User.js";

const ORDEN_DIFICULTAD = ["XS", "S", "M", "L", "XL"];

const normalizarDificultad = (valor) => {
  const v = String(valor || "").toUpperCase().trim();
  if (!ORDEN_DIFICULTAD.includes(v)) return null;
  return v;
};

const rangoDificultad = (min, max) => {
  const a = ORDEN_DIFICULTAD.indexOf(min);
  const b = ORDEN_DIFICULTAD.indexOf(max);
  if (a === -1 || b === -1) return [];
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  return ORDEN_DIFICULTAD.slice(start, end + 1);
};

export const resolvers = {
  Tarea: {
    id: (parent) => parent._id?.toString?.() ?? parent.id,
    asignadaA: async (parent) => {
      if (!parent.asignadaA) return null;
      return await User.findById(parent.asignadaA);
    },
    creadaPor: async (parent) => {
      if (!parent.creadaPor) return null;
      return await User.findById(parent.creadaPor);
    },
  },

  Usuario: {
    id: (parent) => parent._id?.toString?.() ?? parent.id,
    nombre: (parent) => parent.name,
    rol: (parent) => parent.role,
  },

  Query: {
    tareasPorDificultad: async (_, { dificultad }) => {
      const d = normalizarDificultad(dificultad);
      if (!d) throw new Error("Dificultad no valida");

      return await Tarea.find({ dificultad: d });
    },

    tareasPorRangoDificultad: async (_, { min, max }) => {
      const dMin = normalizarDificultad(min);
      const dMax = normalizarDificultad(max);
      if (!dMin || !dMax) throw new Error("Rango de dificultad no valido");

      const lista = rangoDificultad(dMin, dMax);
      return await Tarea.find({ dificultad: { $in: lista } });
    },

    numeroTareasMaximaDificultad: async () => {
      return await Tarea.countDocuments({ dificultad: "XL" });
    },

    tareasDeUsuario: async (_, { usuarioId }) => {
      return await Tarea.find({ asignadaA: usuarioId });
    },

    tareasDeUsuarioPorDificultad: async (_, { usuarioId, dificultad }) => {
      const d = normalizarDificultad(dificultad);
      if (!d) throw new Error("Dificultad no valida");

      return await Tarea.find({ asignadaA: usuarioId, dificultad: d });
    },

    tareasSinAsignarOrdenadas: async () => {
      const orden = ORDEN_DIFICULTAD;

      const res = await Tarea.aggregate([
        { $match: { asignadaA: null } },
        {
          $addFields: {
            dificultadOrden: {
              $indexOfArray: [orden, "$dificultad"],
            },
          },
        },
        { $sort: { duracion: 1, dificultadOrden: 1 } },
        { $project: { dificultadOrden: 0 } },
      ]);

      return res;
    },

    resumenTareasUsuario: async (_, { usuarioId }) => {
      const tareas = await Tarea.find({ asignadaA: usuarioId });

      const resumen = {
        total: tareas.length,
        porHacer: 0,
        haciendo: 0,
        hecha: 0,
      };

      for (const t of tareas) {
        if (t.estado === "por_hacer") resumen.porHacer++;
        else if (t.estado === "haciendo") resumen.haciendo++;
        else if (t.estado === "hecha") resumen.hecha++;
      }

      return resumen;
    },
  },
};