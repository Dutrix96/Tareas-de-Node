import { Router } from "express";
import authJwt from "../middlewares/authJwt.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

router.post("/ping", authJwt, requireRole("admin"), (req, res) => {
  res.json({ ok: true, msg: "Eres admin" });
});

export default router;