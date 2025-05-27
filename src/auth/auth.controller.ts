import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createUserService, userLoginService } from './auth.service';
import jwt from 'jsonwebtoken';


// create user controller
export const registerUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const password = user.password;
        const hashedPassword = await bcrypt.hashSync(password, 10);
        user.password = hashedPassword;

        const createUser = await createUserService(user);
        if (!createUser) return res.json({ message: "User not created" })
        return res.status(201).json({ message: createUser });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

//login user controller
export const loginUserController = async (req: Request, res: Response) => {
    try {
        const user = req.body;

        // check if user exists
        const userExist = await userLoginService(user);
        if (!userExist) {
            return res.status(404).json({ message: "User not found" });
        }

        // verify password
        const userMatch = await bcrypt.compareSync(user.password, userExist.password as string)
        if (!userMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // create a payload for the JWT
        const payload = {
            sub: userExist.id,
            user_id: userExist.id,
            first_name: userExist.firstName,
            last_name: userExist.lastName,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3 // 3 days expiration
        }

        // Generate JWT token
        const secret = process.env.JWT_SECRET as string;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const token = jwt.sign(payload, secret);

        // Return the token and user information
        return res.status(200).json({
            message: "Login Successfull",
            token,
            user: {
                user_id: userExist.id,
                first_name: userExist.firstName,
                last_name: userExist.lastName,
                email: userExist.email
            }
        })

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}