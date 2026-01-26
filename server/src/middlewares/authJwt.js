import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const authJwt = (req, res, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({ ok: false, msg: "No hay token" });
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET);

    req.user = {
      id: payload.uid,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ ok: false, msg: "Token no valido" });
  }
};

export default authJwt;