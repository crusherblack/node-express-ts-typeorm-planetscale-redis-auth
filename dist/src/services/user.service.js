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
exports.signToken = exports.findUser = exports.findAllUsers = exports.findUserById = exports.createUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connectRedis_1 = __importDefault(require("../utils/connectRedis"));
const User_entity_1 = require("../entities/User.entity");
const appDataSource_1 = __importDefault(require("../utils/appDataSource"));
const userRepository = appDataSource_1.default.getRepository(User_entity_1.User);
// CreateUser service
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.save(userRepository.create(Object.assign({}, input)));
});
exports.createUser = createUser;
// Find User by Id
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.findOneBy({ id });
});
exports.findUserById = findUserById;
// Find All users
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.find();
});
exports.findAllUsers = findAllUsers;
// Find one user by any fields
const findUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userRepository.findOneBy(query);
});
exports.findUser = findUser;
// Sign Token
const signToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Sign the access token
    const access_token = jsonwebtoken_1.default.sign({ sub: user.id }, process.env.JWT_KEY, {
        expiresIn: `60m`,
    });
    // Create a Session
    connectRedis_1.default.set(user.id + "", JSON.stringify(user));
    // Return access token
    return { access_token };
});
exports.signToken = signToken;
