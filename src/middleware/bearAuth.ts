import "dotenv/config"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";


// middleware to check if the user is loggedin
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
         res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        // attach the user information to the request object
        (req as any).user = decoded;
        next();

    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
}


