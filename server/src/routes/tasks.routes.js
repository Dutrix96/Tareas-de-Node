import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import requireRole from "../middlewares/requireRole.js";
import taskService from "../services/task.service.js";

const router = Router();

const emitirContador = async (req) => {
  const io = req.app.get("io");
  const redis = req.app.get("redis");
  if (!io || !redis) return;

  const total = await redis.get("tareas:sin_asignar:contador");
  io.emit("contador_sin_asignar", { total: Number(total) });
};

const emitirActualizacion = (req, accion, tarea) => {
  const io = req.app.get("io");
  if (!io) return;

  io.emit("tareas_actualizadas", {
    accion,
    tareaId: tarea?._id || null,
  });
};

//parte de admin que se ve por el requireRole pero lo pongo

router.post("/crear", authJwt, requireRole("admin"), async (req, res) => {
  try {
    const tarea = await taskService.crear(req.body, req.user.id);

    const redis = req.app.get("redis");
    if (redis) await redis.incr("tareas:sin_asignar:contador");

    emitirActualizacion(req, "crear", tarea);
    await emitirContador(req);

    res.status(201).json({ ok: true, tarea });
  } catch (err) {
    res.status(err.statusCode || 500).json({ ok: false, msg: err.message });
  }
});

router.post("/listar", authJwt, requireRole("admin"), async (req, res) => {
  const tareas = await taskService.listarTodas();
  res.json({ ok: true, tareas });
});

//parte de usuario

router.post("/sin-asignar", authJwt, async (req, res) => {
  const tareas = await taskService.listarSinAsignar();
  res.json({ ok: true, tareas });
});

router.post("/coger/:id", authJwt, async (req, res) => {
  try {
    const redis = req.app.get("redis");
    const tarea = await taskService.cogerTarea(req.params.id, req.user.id, redis);

    emitirActualizacion(req, "coger", tarea);
    await emitirContador(req);

    res.json({ ok: true, tarea });
  } catch (err) {
    res.status(err.statusCode || 500).json({ ok: false, msg: err.message });
  }
});

router.post("/soltar/:id", authJwt, async (req, res) => {
  try {
    const redis = req.app.get("redis");
    const tarea = await taskService.soltarTarea(req.params.id, req.user.id, redis);

    emitirActualizacion(req, "soltar", tarea);
    await emitirContador(req);

    res.json({ ok: true, tarea });
  } catch (err) {
    res.status(err.statusCode || 500).json({ ok: false, msg: err.message });
  }
});

router.post("/avanzar/:id", authJwt, async (req, res) => {
  try {
    const tarea = await taskService.avanzarEstado(req.params.id, req.user.id);

    emitirActualizacion(req, "avanzar", tarea);

    res.json({ ok: true, tarea });
  } catch (err) {
    res.status(err.statusCode || 500).json({ ok: false, msg: err.message });
  }
});

//la parte de redis he tenido ayuda fernando

router.post("/contador/sin-asignar", authJwt, async (req, res) => {
  const redis = req.app.get("redis");
  const total = await redis.get("tareas:sin_asignar:contador");

  res.json({
    ok: true,
    total: Number(total),
  });
});

export default router;