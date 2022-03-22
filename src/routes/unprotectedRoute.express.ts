import express, { NextFunction, Request, Response } from "express";
const unprotectedRoute = express.Router();

unprotectedRoute.get(
    "/",
    function (req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({
            message: "We are here!",
        });
    }
);

export { unprotectedRoute };
