import express, { NextFunction, Request, Response } from "express";
const protectedRoute = express.Router();

protectedRoute.get(
    "/",
    function (req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({
            message: "We are a protected route here!",
        });
    }
);

export { protectedRoute };
