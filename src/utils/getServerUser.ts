import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import ApiError from "./ApiError";

const getServerUser = async (req: NextRequest) => {
    const session = await getServerSession();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) throw ApiError.unauthorized('Not authenticated');
    
    if (!session?.user?.email) throw ApiError.unauthorized('User not authenticated!');

    const user = await prisma.user.findUnique({ where: { email: session.user.email }  });

    if (!user) throw ApiError.unauthorized('User not found!');

    return { user, token };
}

export default getServerUser;