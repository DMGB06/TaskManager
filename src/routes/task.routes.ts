import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getMyTasks,
} from "../controllers/task.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  getTasksQuerySchema,
} from "../schemas/task.schema";

const router = Router();
//Todas las rutas requieren autenticacion
router.use(authenticate);

//CRUD de Tareas
router.post("/", validate(createTaskSchema), createTask);
router.get("/", validate(getTasksQuerySchema), getMyTasks);
router.get("/:id", getTaskById);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;