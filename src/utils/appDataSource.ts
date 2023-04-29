import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [User],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  ssl: {
    rejectUnauthorized: true,
  },
});

export default AppDataSource;
