import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const isAuth = async () => {
    try {
        const storedCookie = await cookies();
        const token = storedCookie.get("token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, "jwtsecret");

        if (typeof decoded !== "object" || !decoded.id) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return null;
        }

        return user;

    } catch (error) {
        return null;
    }
}

