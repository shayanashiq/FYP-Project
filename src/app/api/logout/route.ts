import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../utils/responseHelper";
import { ErrorMessages } from "@/utils/errorMessages";
import { verifyToken } from "../../../middleware/verifyToken";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify the user's token to ensure they are authenticated
    const { userId, error } = await verifyToken(req, [
      UserRole.PATIENT,
      UserRole.DOCTOR,
    ]);

    // If token verification fails
    if (error) {
      return errorResponse(error, 401);
    }

    // If the userId is not found (in case of expired or invalid token)
    if (!userId) {
      return errorResponse(ErrorMessages.tokenInvalid, 401);
    }

    // 2. Parse the incoming request to get the device token
    const { deviceToken } = await req.json();

    // If deviceToken is not provided in the request
    if (!deviceToken) {
      return errorResponse(ErrorMessages.deviceTokenRequired, 400);
    }

    // 3. Find the user by userId and get the deviceTokens
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { deviceTokens: true },
    });

    // If the user is not found
    if (!user) {
      return errorResponse(ErrorMessages.userNotFound, 404);
    }

    // If the deviceToken doesn't match any of the stored tokens for the user
    if (!user.deviceTokens.includes(deviceToken)) {
      return errorResponse(ErrorMessages.deviceTokenNotFound, 404);
    }

    // 4. Remove the device token from the user's list of tokens
    const updatedDeviceTokens = user.deviceTokens.filter(
      (token) => token !== deviceToken
    );

    // 5. Update the user's record with the new list of device tokens (after logout)
    await prisma.user.update({
      where: { id: userId },
      data: {
        deviceTokens: updatedDeviceTokens,
      },
    });
    const tour = await prisma.user.update({
      where: { id: userId },
      data: {
        hasSeenTour: true,
      },
    });
    console.log("has seen", tour.hasSeenTour )
    

    // 6. Return success response after logout
    return successResponse({}, `Logout successful from device: ${deviceToken}`);
  } catch (error) {
    // 7. Catch any errors and return the internal server error message
    const errorMessage = error || ErrorMessages.internalServerError;
    const responseMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${errorMessage}`
        : ErrorMessages.internalServerErrorProduction;
    return errorResponse(responseMessage, 500);
  }
}
