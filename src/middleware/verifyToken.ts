import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { ErrorMessages } from "@/utils/errorMessages";

interface DecodedToken {
  id: number;
  role: UserRole;
}

export async function verifyToken(
  req: NextRequest,
  allowedRoles?: UserRole[]
): Promise<{ userId?: number; error?: string }> {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return { error: "No token provided" };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "N4wL1NMnook2oQA47D6t3m3gw4bnlepd"
    ) as DecodedToken;

    // if (allowedRoles && allowedRoles.length > 0) {
    //   if (!allowedRoles.includes(decoded.role)) {
    //     return { error: ErrorMessages.AccessDenied };
    //   }
    // }

    return { userId: decoded.id };
  } catch (err) {
    return { error: "Invalid token" };
  }
}
