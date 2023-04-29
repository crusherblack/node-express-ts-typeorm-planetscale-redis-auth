import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import { createUser, findUser, signToken } from "../services/user.service";
import AppError from "../utils/appError";

// Exclude this fields from the response
export const excludedFields = ["password"];

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + 60 * 60 * 1000),
  maxAge: 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true;

export const registerHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const registerUser = await findUser({ email: req.body.email });

    if (registerUser) {
      return next(new AppError("Email already registered", 401));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
    });

    const { password, ...restUser } = user;

    res.status(201).json({
      status: "success",
      data: {
        user: restUser,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: "Email already exist",
      });
    }
    next(err);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);

    // Check if user exist and password is correct
    if (!user || !validPass) {
      return next(new AppError("Invalid email or password", 401));
    }

    const { password, ...restUser } = user;

    // Create an Access Token
    const { access_token } = await signToken(restUser);

    // Send Access Token in Cookie
    res.cookie("accessToken", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // Send Access Token
    res.status(200).json({
      status: "success",
      accessToken: access_token,
    });
  } catch (err: any) {
    next(err);
  }
};
