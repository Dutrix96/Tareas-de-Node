import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../config/env.js";
import googleService from "./google.service.js";

const generarJWT = (uid, role) => {
  const payload = { uid, role };
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
};

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const e = new Error("Faltan datos");
    e.statusCode = 400;
    throw e;
  }

  if (password.length < 6) {
    const e = new Error("Password demasiado corta (minimo 6)");
    e.statusCode = 400;
    throw e;
  }

  const existe = await User.findOne({ email });
  if (existe) {
    const e = new Error("El email ya existe");
    e.statusCode = 400;
    throw e;
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const user = await User.create({
    name,
    email,
    passwordHash,
    authProvider: "local",
    role: "user",
  });

  const token = generarJWT(user._id.toString(), user.role);

  return { user, token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    const e = new Error("Faltan datos");
    e.statusCode = 400;
    throw e;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const e = new Error("Credenciales incorrectas");
    e.statusCode = 400;
    throw e;
  }

  if (user.authProvider === "google") {
    const e = new Error("Este usuario usa login con Google");
    e.statusCode = 400;
    throw e;
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    const e = new Error("Credenciales incorrectas");
    e.statusCode = 400;
    throw e;
  }

  const token = generarJWT(user._id.toString(), user.role);

  return { user, token };
};

const loginGoogle = async ({ id_token, idToken }) => {
  const tokenGoogle = id_token || idToken;

  const info = await googleService.verificarIdTokenGoogle(tokenGoogle);

  let user = await User.findOne({ email: info.email });

  if (!user) {
    user = await User.create({
      name: info.name,
      email: info.email,
      googleId: info.googleId,
      authProvider: "google",
      role: "user",
    });
  } else {
    if (user.authProvider === "google" && !user.googleId) {
      user.googleId = info.googleId;
      await user.save();
    }

    if (user.authProvider === "local") {
      const e = new Error(
        "Ya existe un usuario local con ese email. Inicia sesion con password."
      );
      e.statusCode = 400;
      throw e;
    }
  }

  const token = generarJWT(user._id.toString(), user.role);
  return { user, token };
};

export default {
  register,
  login,
  loginGoogle,
};