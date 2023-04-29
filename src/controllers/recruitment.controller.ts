import { NextFunction, Request, Response } from "express";
import {
  getDetailPositions,
  getPositions,
} from "../services/recruitment.service";

export const getAllPositionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = await getPositions(req.query);

    res.status(200).json({
      status: "success",
      data: {
        positions: data,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getDetailPositionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = await getDetailPositions(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        positions: data,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
