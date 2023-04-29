"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../entities/User.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [User_entity_1.User],
    migrations: ["src/migrations/**/*{.ts,.js}"],
    ssl: {
        rejectUnauthorized: true,
    },
});
exports.default = AppDataSource;
