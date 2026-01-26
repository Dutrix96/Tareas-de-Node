import { useState } from "react";
import { gqlRequest, Q_NUM_XL, Q_TAREAS_POR_DIFICULTAD, Q_TAREAS_SIN_ASIGNAR_ORD } from "../api/graphql.js";

export default function Queries({ token }) {
  const [dificultad, setDificultad] = useState("M");
  const [salida, setSalida] = useState("");
  const [error, setError] = useState("");

  const ejecutar = async (tipo) => {
    setError("");
    setSalida("");

    try {
      if (tipo === "porDificultad") {
        const data = await gqlRequest(token, Q_TAREAS_POR_DIFICULTAD, { dificultad });
        setSalida(JSON.stringify(data, null, 2));
      } else if (tipo === "sinAsignarOrd") {
        const data = await gqlRequest(token, Q_TAREAS_SIN_ASIGNAR_ORD);
        setSalida(JSON.stringify(data, null, 2));
      } else if (tipo === "numXL") {
        const data = await gqlRequest(token, Q_NUM_XL);
        setSalida(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setError(e.message || "Error GraphQL");
    }
  };

  return (
    <div className="card">
      <div className="card__header">
        <h3>Consultas GraphQL (demo)</h3>
      </div>

      <div className="row">
        <label className="field">
          <span>Dificultad</span>
          <select value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </label>

        <div className="row__actions">
          <button className="btn btn--small" onClick={() => ejecutar("porDificultad")}>
            Tareas por dificultad
          </button>
          <button className="btn btn--small btn--ghost" onClick={() => ejecutar("sinAsignarOrd")}>
            Sin asignar ordenadas
          </button>
          <button className="btn btn--small btn--ghost" onClick={() => ejecutar("numXL")}>
            Numero XL
          </button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {salida && <pre className="code">{salida}</pre>}
    </div>
  );
}