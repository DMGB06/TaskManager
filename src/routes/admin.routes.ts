import Router from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { adminUpdateUserSchema } from "../schemas/user.schema";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller";

const router = Router();

// Todas las rutas requieren autenticación + rol admin
router.use(authenticate);
router.use(requireAdmin);

// CRUD completo de usuarios
router.get("/users", getAllUsers); // Listar todos
router.get("/users/:id", getUserById); // Ver uno
router.patch("/users/:id", validate(adminUpdateUserSchema), updateUser); // Modificar
router.delete("/users/:id", deleteUser); // Eliminar

export default router;
