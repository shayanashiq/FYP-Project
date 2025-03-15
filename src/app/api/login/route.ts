import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../utils/responseHelper";
import { ErrorMessages } from "@/utils/errorMessages";
import { UserRole } from "@prisma/client";
import { loginResponseDto } from "@/utils/responseMapper/userResponseMapper";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";



export async function POST(req: NextRequest) {
  const { email, password, role, deviceToken } = await req.json();

  if (!email || !password) {
    return errorResponse("Email and password are required", 400);
  }


  try {
    const userQuery: any = {
      where: {
        role: role,
        email: {
          equals: email,
          mode: 'insensitive'
        },
      },
      include: {},
    };

    if (role === UserRole.PATIENT) {
      userQuery.include.patientDoctors = {
        where: {
          status: "ACCEPTED",
        },
        include: {
          doctor: {
            include: {
              doctorProfile: true,
            },
          },
        },
      };
      userQuery.include.patientProfile = true;
    } else if (role === UserRole.DOCTOR) {
      userQuery.include.doctorProfile = true;
    }

    const user = await prisma.user.findFirst(userQuery);

    if (!user) {
      return errorResponse(ErrorMessages.invalidEmailOrPassword, 401);
    }

    if (!user.password) {
      return errorResponse(ErrorMessages.invalidEmailOrPassword, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(ErrorMessages.invalidEmailOrPassword, 401);
    }
    const token = jwt.sign(
      { email: user.email, id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    if (deviceToken) {
      const user: any = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user.deviceTokens.includes(deviceToken)) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            deviceTokens: {
              push: deviceToken,
            },
          },
        });
      }
    }



    let { password: userPass, ...currUser } = user;
    const responseData = loginResponseDto(currUser, role);
    return successResponse({ ...responseData, token }, "Login successful");
  } catch (error) {
    const errorMessage = error || ErrorMessages.internalServerError;
    ErrorMessages;
    // const responseMessage =
    //   process.env.NODE_ENV === "development"
    //     ? `Error: ${errorMessage}`
    //     : ErrorMessages.internalServerErrorProduction;
    // return errorResponse(responseMessage, 500);
  }
}
