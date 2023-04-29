import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { findUserById } from "../services/user.service";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";

type Decoded = { sub: string };
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return next(new AppError("You are not logged in", 401));
    }

    // Validate Access Token
    const decoded = jwt.verify(
      access_token,
      process.env.JWT_KEY as string
    ) as Decoded;

    if (!decoded) {
      return next(new AppError(`Invalid token or user doesn't exist`, 401));
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new AppError(`User session has expired`, 401));
    }

    // Check if user still exist
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(`User with that token no longer exist`, 401));
    }

    const { password, ...restUser } = user;

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = restUser;

    next();
  } catch (err: any) {
    next(err);
  }
};
