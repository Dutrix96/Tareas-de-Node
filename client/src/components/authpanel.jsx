import { useState } from "react";
import { apiLogin, apiRegister } from "../api/auth.js";
import LoginGoogle from "./logingoogle.jsx";

export default function AuthPanel({ onLogin }) {
  const [modo, setModo] = useState("login"); // login | register
  const [name, setName] = useState("Pepe");
  const [email, setEmail] = useState("pepe@a.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res =
        modo === "register"
          ? await apiRegister(name, email, password)
          : await apiLogin(email, password);

      if (!res?.ok) throw new Error(res?.msg || "Error");

      onLogin({ token: res.token, user: res.user });
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setCargando(false);
    }
  };

  const handleGoogleOk = (res) => {
    // res viene del componente logingoogle.jsx: { ok, user, token }
    if (!res?.ok) {
      setError(res?.msg || "Error login Google");
      return;
    }
    setError("");
    onLogin({ token: res.token, user: res.user });
  };

  return (
    <div className="card">
      <div className="card__header">
        <h2>{modo === "login" ? "Login" : "Registro"}</h2>
        <div className="segmented">
          <button
            className={modo === "login" ? "segmented__btn is-active" : "segmented__btn"}
            onClick={() => setModo("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={modo === "register" ? "segmented__btn is-active" : "segmented__btn"}
            onClick={() => setModo("register")}
            type="button"
          >
            Registro
          </button>
        </div>
      </div>

      <form className="form" onSubmit={submit}>
        {modo === "register" && (
          <label className="field">
            <span>Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        )}

        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <div className="alert">{error}</div>}

        <button className="btn" disabled={cargando}>
          {cargando ? "Cargando..." : modo === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
        <LoginGoogle onLoginOk={handleGoogleOk} />
      </div>
    </div>
  );
}