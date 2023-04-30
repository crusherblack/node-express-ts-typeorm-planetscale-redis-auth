import express from "express";
import {
  getAllPositionsHandler,
  getSinglePositionsHandler,
} from "../controllers/recruitments.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();
router.use(deserializeUser, requireUser);

// Get my info route
router.get("/positions", getAllPositionsHandler);
router.get("/positions/:id", getSinglePositionsHandler);

export default router;
