const requireRole = (roleRequerido) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({ ok: false, msg: "Falta authJwt" });
    }

    if (req.user.role !== roleRequerido) {
      return res.status(403).json({ ok: false, msg: "No tienes permisos" });
    }

    next();
  };
};

export default requireRole;