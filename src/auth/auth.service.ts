import db from "../Drizzle/db";
import { TIUser, UsersTable } from "../Drizzle/schema";

export const createUserService = async (user: TIUser) => {
    await db.insert(UsersTable).values(user);
    return "User created successfully";
}