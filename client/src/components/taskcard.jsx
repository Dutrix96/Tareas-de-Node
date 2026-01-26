export default function TaskCard({ tarea, onCoger, onSoltar, onAvanzar, esMia }) {
  return (
    <div className="task">
      <div className="task__main">
        <div className="task__title">{tarea.descripcion}</div>
        <div className="task__meta">
          <span className="chip">{tarea.dificultad}</span>
          <span className="chip">{tarea.duracion}h</span>
          <span className="chip chip--soft">{tarea.estado}</span>
        </div>
      </div>

      <div className="task__actions">
        {!tarea.asignadaA && (
          <button className="btn btn--small" onClick={() => onCoger(tarea._id || tarea.id)}>
            Coger
          </button>
        )}

        {esMia && (
          <>
            <button className="btn btn--small btn--ghost" onClick={() => onSoltar(tarea._id || tarea.id)}>
              Soltar
            </button>
            <button className="btn btn--small btn--ghost" onClick={() => onAvanzar(tarea._id || tarea.id)}>
              Avanzar
            </button>
          </>
        )}
      </div>
    </div>
  );
}