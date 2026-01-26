import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },

    duracion: {
      type: Number,
      required: true,
      min: 0,
    },

    dificultad: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"],
      required: true,
    },

    estado: {
      type: String,
      enum: ["por_hacer", "haciendo", "hecha"],
      default: "por_hacer",
    },

    asignadaA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    creadaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tarea = mongoose.model("Tarea", tareaSchema);

export default Tarea;