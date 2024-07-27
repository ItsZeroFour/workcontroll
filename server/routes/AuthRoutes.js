import express from "express";
import { AuthControllers } from "../controllers/index.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.post("/register", AuthControllers.registration);
router.post("/login", AuthControllers.login);
router.get("/me", checkAuth, AuthControllers.me);

export default router;
