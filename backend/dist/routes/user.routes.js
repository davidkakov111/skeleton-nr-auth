// Example protected routes
import { Router } from "express";
// import { getProfile } from "../controllers/user.controller";
// import { authenticateJWT } from "../middleware/auth";
// import { authorizeRoles } from "../middleware/roles";
const router = Router();
router.get("/", () => { console.log("User route"); });
// // Any authenticated user
// router.get("/me", authenticateJWT, getProfile);
// // Admin only
// router.get("/admin", authenticateJWT, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Admin content" });
// });
export default router;
//# sourceMappingURL=user.routes.js.map