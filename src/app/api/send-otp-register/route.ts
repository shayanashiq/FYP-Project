// import required dependencies
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../utils/responseHelper";
import { ErrorMessages } from "@/utils/errorMessages";

const OAUTH_EMAIL = process.env.OAUTH_EMAIL;
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
const OAUTH_ACCESS_TOKEN = process.env.OAUTH_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
    let { email } = await req.json();
  
    if (!email) {
      return errorResponse(ErrorMessages.emailRequired, 400);
    }



  
    const user = await prisma.user.findUnique({
      where: { email, verified: true, isPasswordSet: true },
    });
    console.log("user", user)
  
    if (user && user.role === "PATIENT") {
      return errorResponse(ErrorMessages.patientFound, 404)
    }else if(user){
      return errorResponse(ErrorMessages.userFound, 404);
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      await prisma.otp.create({
        data: {
          email,
          otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 05 minutes expiration
        },
      });
      // create OAuth2 client
      const oauth2Client = new OAuth2(
        OAUTH_CLIENT_ID,
        OAUTH_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );

      // set refresh token
      oauth2Client.setCredentials({
        refresh_token: OAUTH_REFRESH_TOKEN
      });

      // get access token using promise
      const accessToken = OAUTH_ACCESS_TOKEN || ""

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: OAUTH_EMAIL,
            clientId: OAUTH_CLIENT_ID,
            clientSecret: OAUTH_CLIENT_SECRET,
            refreshToken: OAUTH_REFRESH_TOKEN,
            accessToken: accessToken.toString()
        }
        });

        
        await transporter.sendMail({
          from: '"AVA ONE" <sajeelashiq1@gmail.com>',
          to: email,
          subject: "Your OTP Code - AVA ONE",
          html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border-radius: 10px;">
              <div style="background: linear-gradient(to bottom, #579FE1, #2290F3); padding: 15px; border-radius: 10px;">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff;">AVA ONE</h1>
              </div>
              <div style="margin-top: 20px; padding: 20px; background-color: #ffffff; border-radius: 10px; border: 2px solid #2290F3;">
                <p style="font-size: 20px; color: #2290F3; margin: 0;">Your OTP Code</p>
                <div style="margin: 10px 0; padding: 10px; border-radius: 5px; background-color: #f0f4f8; display: inline-block;">
                  <p style="font-size: 32px; font-weight: bold; color: #2290F3; letter-spacing: 5px;">${otp}</p>
                </div>
                <p style="font-size: 16px; color: #555555; margin-top: 20px;">Enter this code to verify your account.</p>
                <p style="font-size: 14px; color: #777777; margin-top: 10px;">If you didn't request this code, please disregard this email.</p>
              </div>
              <div style="margin-top: 30px; padding: 10px; border-top: 1px solid #2290F3;">
                <p style="font-size: 12px; color: #777777;">© 2024 AVA ONE. All rights reserved.</p>
                
              </div>
            </div>
          `,
        });
    
        return successResponse(null, "Verification email sent successfully.");
    } catch (error:any) {
        // const errorMessage = error || ErrorMessages.internalServerError;
        // ErrorMessages;
        // const responseMessage =
        //   process.env.NODE_ENV === "development"
        //     ? `Error: ${errorMessage}`
        //     : ErrorMessages.internalServerErrorProduction;
        return errorResponse(error, 500);
    }
  }








