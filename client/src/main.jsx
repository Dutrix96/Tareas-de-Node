import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="210597138335-dakest00dn9ctmq1glu2gi154gi3ca0c.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);