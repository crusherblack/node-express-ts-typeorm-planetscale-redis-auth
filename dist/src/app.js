"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const appDataSource_1 = __importDefault(require("./utils/appDataSource"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
appDataSource_1.default.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // Middleware
    // 1. Body Parser
    app.use(express_1.default.json({ limit: "10kb" }));
    // 2. Cookie Parser
    app.use((0, cookie_parser_1.default)());
    // 3. Logger
    if (process.env.NODE_ENV === "development")
        app.use((0, morgan_1.default)("dev"));
    // 4. Cors
    app.use((0, cors_1.default)({
        origin: process.env.FRONTED_ORIGIN,
        credentials: true,
    }));
    // 5. Routes
    app.use("/api/users", user_route_1.default);
    app.use("/api/auth", auth_route_1.default);
    // Testing
    app.get("/healthChecker", (req, res, next) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to CodevoWeb????",
        });
    });
    // UnKnown Routes
    app.all("*", (req, _, next) => {
        const err = new Error(`Route ${req.originalUrl} not found`);
        err.statusCode = 404;
        next(err);
    });
    // Global Error Handler
    app.use((err, _, res, _n) => {
        err.status = err.status || "error";
        err.statusCode = err.statusCode || 500;
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    });
    const port = 8000;
    app.listen(port, () => {
        console.log(`Server started on port: ${port}`);
    });
}))
    .catch((error) => console.log(error));
