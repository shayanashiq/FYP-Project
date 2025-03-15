import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../../../utils/responseHelper";
import { ErrorMessages } from "@/utils/errorMessages";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: NextRequest) {
  const { email, newPassword, confirmPassword } = await req.json();

  if (!email && !newPassword && !confirmPassword) {
    return errorResponse(ErrorMessages.emailPasswordRequired, 400);
  }

  if (!email) {
    return errorResponse(ErrorMessages.emailRequired, 400);
  }
  if (!newPassword) {
    return errorResponse(ErrorMessages.newPasswordRequired, 400);
  }
  if (!confirmPassword) {
    return errorResponse(ErrorMessages.confirmPasswordRequired, 400);
  }

  if (newPassword !== confirmPassword) {
    return errorResponse(ErrorMessages.passwordMismatch, 400);
  }
  const normalizedEmail = email.replace(/\s+/g, "").toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email:normalizedEmail, verified: true },
    });

    if (!user) {
      return errorResponse(ErrorMessages.userNotFound, 404);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email:normalizedEmail },
      data: {
        password: hashedNewPassword,
        isPasswordSet: true,
        role: "DOCTOR",
      },
    });

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET || "your_jwt_secret", // Ensure JWT_SECRET is in your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    let { password: userPass, ...currUser } = user;

    return successResponse({ ...currUser, token }, "Password set successfully");
  } catch (error) {
    const errorMessage = error || ErrorMessages.internalServerError;
    ErrorMessages;
    const responseMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${errorMessage}`
        : ErrorMessages.internalServerErrorProduction;
    return errorResponse(responseMessage, 500);
  }
}
