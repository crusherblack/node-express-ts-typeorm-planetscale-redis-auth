import { NextFunction, Request, Response } from "express";
import { findAllUsers } from "../services/user.service";
import { getAllPositions, getSinglePosition } from "../services/recruitment";

export const getAllPositionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = await getAllPositions(req.query);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getSinglePositionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = await getSinglePosition(req.params.id);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err: any) {
    next(err);
  }
};
