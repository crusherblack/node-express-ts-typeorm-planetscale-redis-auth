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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersHandler = exports.getMeHandler = void 0;
const user_service_1 = require("../services/user.service");
const getMeHandler = (_, res, next) => {
    try {
        const user = res.locals.user;
        res.status(200).json({
            status: "success",
            data: {
                user,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMeHandler = getMeHandler;
const getAllUsersHandler = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_service_1.findAllUsers)();
        res.status(200).json({
            status: "success",
            result: users.length,
            data: {
                users,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsersHandler = getAllUsersHandler;
