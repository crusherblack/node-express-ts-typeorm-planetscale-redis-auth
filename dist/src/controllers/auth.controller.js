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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.registerHandler = exports.excludedFields = void 0;
const config_1 = __importDefault(require("config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../services/user.service");
const appError_1 = __importDefault(require("../utils/appError"));
// Exclude this fields from the response
exports.excludedFields = ["password"];
// Cookie options
const accessTokenCookieOptions = {
    expires: new Date(Date.now() + config_1.default.get("accessTokenExpiresIn") * 60 * 1000),
    maxAge: config_1.default.get("accessTokenExpiresIn") * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
// Only set secure to true in production
if (process.env.NODE_ENV === "production")
    accessTokenCookieOptions.secure = true;
const registerHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const registerUser = yield (0, user_service_1.findUser)({ email: req.body.email });
        if (registerUser) {
            return next(new appError_1.default("Email already registered", 401));
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = yield (0, user_service_1.createUser)({
            email: req.body.email,
            name: req.body.name,
            password: hashedPassword,
        });
        const { password } = user, restUser = __rest(user, ["password"]);
        res.status(201).json({
            status: "success",
            data: {
                user: restUser,
            },
        });
    }
    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                status: "fail",
                message: "Email already exist",
            });
        }
        next(err);
    }
});
exports.registerHandler = registerHandler;
const loginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the user from the collection
        const user = yield (0, user_service_1.findUser)({ email: req.body.email });
        if (!user) {
            return next(new appError_1.default("Invalid email or password", 401));
        }
        const validPass = yield bcrypt_1.default.compare(req.body.password, user.password);
        // Check if user exist and password is correct
        if (!user || !validPass) {
            return next(new appError_1.default("Invalid email or password", 401));
        }
        const { password } = user, restUser = __rest(user, ["password"]);
        // Create an Access Token
        const { access_token } = yield (0, user_service_1.signToken)(restUser);
        // Send Access Token in Cookie
        res.cookie("accessToken", access_token, accessTokenCookieOptions);
        res.cookie("logged_in", true, Object.assign(Object.assign({}, accessTokenCookieOptions), { httpOnly: false }));
        // Send Access Token
        res.status(200).json({
            status: "success",
            accessToken: access_token,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.loginHandler = loginHandler;
