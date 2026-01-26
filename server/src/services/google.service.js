import { OAuth2Client } from "google-auth-library";
import { ENV } from "../config/env.js";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

const verificarIdTokenGoogle = async (idToken) => {
  if (!idToken) {
    const e = new Error("Falta id_token");
    e.statusCode = 400;
    throw e;
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: ENV.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload?.email) {
    const e = new Error("Token de Google invalido");
    e.statusCode = 401;
    throw e;
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.given_name ?? "Usuario Google",
    picture: payload.picture ?? null,
  };
};

export default {
  verificarIdTokenGoogle,
};