import express from "express";
import { OrderControllers } from "../controllers/index.js";

const router = express.Router();

router.post("/create", OrderControllers.createOrder);
router.get("/get/:id", OrderControllers.getOrder);
router.patch("/update", OrderControllers.updateOrder);
router.get("/getAll", OrderControllers.getAllOrders);
router.patch("/upload/:id", OrderControllers.uploadFileToOrder);

export default router;
