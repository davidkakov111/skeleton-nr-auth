import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import { updateUserEmail, updateUserPassword } from "../controllers/user.controller.js";

const router = Router();

// Apply middleware to all user routes
router.use(verifyJWT);

router.put("/me/email", updateUserEmail);
router.put("/me/password", updateUserPassword);

export default router;
