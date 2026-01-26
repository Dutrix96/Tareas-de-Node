import { useEffect, useMemo, useRef, useState } from "react";
import { apiAvanzarTarea, apiCogerTarea, apiContadorSinAsignar, apiSoltarTarea, apiTareasSinAsignar } from "../api/tareas.js";
import { crearSocket } from "../socket.js";
import TaskCard from "./taskcard.jsx";
import Queries from "./queries.jsx";

export default function Dashboard({ token, user }) {
  const [contador, setContador] = useState(0);
  const [sinAsignar, setSinAsignar] = useState([]);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  const userId = useMemo(() => {
    // tu backend devuelve user con _id o con id? en REST devuelve _id (mongoose).
    // en tu register/login actual: user trae _id.
    return user?._id || user?.id || "";
  }, [user]);

  const cargarContador = async () => {
    const res = await apiContadorSinAsignar(token);
    if (res.ok) setContador(res.total);
  };

  const cargarSinAsignar = async () => {
    const res = await apiTareasSinAsignar(token);
    if (res.ok) setSinAsignar(res.tareas);
  };

  const recargar = async () => {
    await Promise.all([cargarContador(), cargarSinAsignar()]);
  };

  useEffect(() => {
    setError("");
    recargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const socket = crearSocket();
    socketRef.current = socket;

    socket.on("contador_sin_asignar", (data) => {
      setContador(Number(data?.total ?? 0));
    });

    socket.on("tareas_actualizadas", async () => {
      // estilo clase: recargar listas cuando cambie algo
      await recargar();
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onCoger = async (id) => {
    setError("");
    try {
      await apiCogerTarea(token, id);
      await recargar();
    } catch (e) {
      setError(e.message || "Error");
    }
  };

  const onSoltar = async (id) => {
    setError("");
    try {
      await apiSoltarTarea(token, id);
      await recargar();
    } catch (e) {
      setError(e.message || "Error");
    }
  };

  const onAvanzar = async (id) => {
    setError("");
    try {
      await apiAvanzarTarea(token, id);
      await recargar();
    } catch (e) {
      setError(e.message || "Error");
    }
  };

  // Como el backend no tiene endpoint "mis tareas", lo sacamos del propio listado sin asignar no.
  // En este cliente, "mis tareas" se ven cuando refrescas desde Mongo via otras consultas.
  // Para que se vea completo, lo ideal es que anadamos endpoint /tareas/mias en backend (si quieres lo hacemos).
  const miasPlaceholder = [];

  return (
    <div className="grid">
      <section className="card">
        <div className="card__header">
          <h2>Dashboard</h2>
          <div className="kpi">
            <span className="kpi__label">Tareas sin asignar</span>
            <span className="kpi__value">{contador}</span>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="split">
          <div>
            <h3>Sin asignar</h3>
            {sinAsignar.length === 0 ? (
              <p className="muted">No hay tareas sin asignar.</p>
            ) : (
              <div className="stack">
                {sinAsignar.map((t) => (
                  <TaskCard
                    key={t._id}
                    tarea={t}
                    onCoger={onCoger}
                    onSoltar={onSoltar}
                    onAvanzar={onAvanzar}
                    esMia={false}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3>Mis tareas</h3>

            {miasPlaceholder.length === 0 && <p className="muted">Pendiente (ver nota).</p>}
          </div>
        </div>
      </section>

      <Queries token={token} />
    </div>
  );
}