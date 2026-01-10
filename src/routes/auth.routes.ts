import { Router } from "express";
import {
  register,
  login,
  logout,
  me,
  updateProfile,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
} from "../schemas/user.schema";

const router = Router();

//rutas publicas

router.post("/register", validate(createUserSchema), register);
router.post("/login", validate(loginUserSchema), login);
// rutas protegidas (requieren token)

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  updateProfile
);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
