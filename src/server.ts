import express, { Application } from "express";
import connectDB from "./configs/db";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import taskRoutes from "./routes/task.routes";
import weeklyRoutineRoutes from "./routes/weeklyRoutine.routes"; // ← AGREGAR
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();
app.use(helmet());
app.use(cors());
//Coneccion con la base de datos
connectDB();

//middlewares
app.use(express.json({ limit: "10mb" }));

//rutas
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/tasks", taskRoutes);
app.use("/routines", weeklyRoutineRoutes);
//mensage para marcar el correcto funcionamiento
app.get("/", (req, res) => {
  res.json("Funcionando correctamente");
});

// Manejo de errores (al final)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API lista: http://localhost:${PORT}/`);
});
