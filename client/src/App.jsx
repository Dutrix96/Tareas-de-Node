import { useEffect, useMemo, useState } from "react";
import AuthPanel from "./components/authpanel.jsx";
import Dashboard from "./components/dashboard.jsx";

const leerSesion = () => {
  const token = localStorage.getItem("token") || "";
  const userRaw = localStorage.getItem("user") || "";
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  return { token, user };
};

export default function App() {
  const [sesion, setSesion] = useState(() => leerSesion());

  const isAuthed = useMemo(() => !!sesion.token, [sesion.token]);

  useEffect(() => {
    if (!sesion.token) return;
  }, [sesion.token]);

  const onLogin = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSesion({ token, user });
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSesion({ token: "", user: null });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__left">
          <h1>Gestor de Tareas</h1>
          <span className="badge">DAW</span>
        </div>

        <div className="topbar__right">
          {isAuthed ? (
            <>
              <div className="userpill">
                <span className="userpill__name">{sesion.user?.name || "Usuario"}</span>
                <span className="userpill__role">{sesion.user?.role || "user"}</span>
              </div>
              <button className="btn btn--ghost" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <span className="muted">Inicia sesion</span>
          )}
        </div>
      </header>

      <main className="container">
        {!isAuthed ? (
          <AuthPanel onLogin={onLogin} />
        ) : (
          <Dashboard token={sesion.token} user={sesion.user} />
        )}
      </main>

      <footer className="footer">
        <span>Cliente React + SCSS + Socket.io + REST + GraphQL</span>
      </footer>
    </div>
  );
}