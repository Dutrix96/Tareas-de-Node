import { Router } from "express";
import userService from "../services/user.service.js";
import authJwt from "../middlewares/authJwt.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { user, token } = await userService.register(req.body);
    res.status(201).json({ ok: true, user, token });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ ok: false, msg: err.message || "Error interno" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, token } = await userService.login(req.body);
    res.json({ ok: true, user, token });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ ok: false, msg: err.message || "Error interno" });
  }
});

router.post("/me", authJwt, async (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;