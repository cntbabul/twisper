import type { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error occurred:", {
        message: err.message,
        stack: err.stack,
        details: err
    });

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message || "Internal Error",
        error: err.toString(),
        stack: err.stack
    })
}