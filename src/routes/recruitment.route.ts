import express from "express";

import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import {
  getAllPositionsHandler,
  getDetailPositionsHandler,
} from "../controllers/recruitment.controller";

const router = express.Router();
router.use(deserializeUser, requireUser);

router.get("/positions", getAllPositionsHandler);
router.get("/positions/:id", getDetailPositionsHandler);

export default router;
