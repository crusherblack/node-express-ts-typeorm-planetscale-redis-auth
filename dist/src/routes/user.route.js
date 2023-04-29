"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const deserializeUser_1 = require("../middleware/deserializeUser");
const requireUser_1 = require("../middleware/requireUser");
const restrictTo_1 = require("../middleware/restrictTo");
const router = express_1.default.Router();
router.use(deserializeUser_1.deserializeUser, requireUser_1.requireUser);
// Admin Get Users route
router.get("/", (0, restrictTo_1.restrictTo)("admin"), user_controller_1.getAllUsersHandler);
// Get my info route
router.get("/me", user_controller_1.getMeHandler);
exports.default = router;
