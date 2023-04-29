"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const restrictTo = (...allowedRoles) => (_, res, next) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) {
        return next(new appError_1.default("You are not allowed to perform this action", 403));
    }
    next();
};
exports.restrictTo = restrictTo;
