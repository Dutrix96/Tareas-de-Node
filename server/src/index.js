import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { ENV } from "./config/env.js";
import Tarea from "./models/Task.js";
import { initSocket } from "./realtime/socket.js";
import { initGraphQL } from "./graphql/apollo.js";

const startServer = async () => {
  try {
    await connectDB();

    const redisClient = await connectRedis();

    const totalSinAsignar = await Tarea.countDocuments({ asignadaA: null });
    await redisClient.set("tareas:sin_asignar:contador", totalSinAsignar);

    app.set("redis", redisClient);

    const httpServer = http.createServer(app);
    const io = initSocket(httpServer);

    app.set("io", io);

    await initGraphQL(app);

    httpServer.listen(ENV.PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    console.error("Error arrancando el servidor:", err);
  }
};

startServer();