import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../config/env.js";

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

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    const e = new Error("Credenciales incorrectas");
    e.statusCode = 400;
    throw e;
  }

  const token = generarJWT(user._id.toString(), user.role);

  return { user, token };
};

export default {
  register,
  login,
};