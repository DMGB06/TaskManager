import { Router } from "express";
import {
  createRoutine,
  getMyRoutines,
  getWeeklySchedule,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
} from "../controllers/weeklyRoutine.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createWeeklyRoutineSchema,
  updateWeeklyRoutineSchema,
  getWeeklyRoutinesQuerySchema,
} from "../schemas/weeklyRoutine.schema";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// CRUD de rutinas semanales
router.post("/", validate(createWeeklyRoutineSchema), createRoutine);
router.get("/", validate(getWeeklyRoutinesQuerySchema), getMyRoutines);
router.get("/weekly-schedule", getWeeklySchedule);  // Horario completo
router.get("/:id", getRoutineById);
router.patch("/:id", validate(updateWeeklyRoutineSchema), updateRoutine);
router.delete("/:id", deleteRoutine);

export default router;