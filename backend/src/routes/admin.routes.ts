import { Router } from "express";
import { authorizeRoles, verifyJWT } from "../middleware/auth.js";
import {
  getAllUsers,
  updateUserRole,
} from "../controllers/admin.controller.js";

const router = Router();

// Apply middleware to all admin routes
router.use(verifyJWT, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.put("/update-user-role", updateUserRole);

export default router;
