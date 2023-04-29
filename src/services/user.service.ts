import { FindOptionsWhere } from "typeorm";
import jwt from "jsonwebtoken";

import redisClient from "../utils/connectRedis";

import { User } from "../entities/User.entity";

import AppDataSource from "../utils/appDataSource";

const userRepository = AppDataSource.getRepository(User);

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  return await userRepository.save(userRepository.create({ ...input }));
};

// Find User by Id
export const findUserById = async (id: number) => {
  return await userRepository.findOneBy({ id });
};

// Find All users
export const findAllUsers = async () => {
  return await userRepository.find();
};

// Find one user by any fields
export const findUser = async (query: FindOptionsWhere<User>) => {
  return await userRepository.findOneBy(query);
};

// Sign Token
export const signToken = async (user: Omit<User, "password">) => {
  // Sign the access token
  const access_token = jwt.sign(
    { sub: user.id },
    process.env.JWT_KEY as string,
    {
      expiresIn: `60m`,
    }
  );

  // Create a Session
  redisClient.set(user.id + "", JSON.stringify(user));

  // Return access token
  return { access_token };
};
