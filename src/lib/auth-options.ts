import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosResponse } from "axios";
import { PrismaClient } from "@prisma/client";
import { ROLE } from "@/common/constant/apis-urls";

const prisma = new PrismaClient();

export const authOptions: any = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSettingPassword: { label: "IsSettingPassword", type: "hidden" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        let user;
        if (credentials?.isSettingPassword === "true") {
          console.log("User is setting a new password...");

          const response = await fetch("http://localhost:3000/api/password-save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              newPassword: credentials?.password,
              confirmPassword: credentials?.password,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to set password.");
          }

          const result = await response.json();
          user = result.data;
        } else {
          console.log("User is logging in...");

          const response: AxiosResponse = await axios.post("http://localhost:3000/api/login", {
            email: credentials?.email,
            password: credentials?.password,
            role: ROLE.CUSTOMER,
          });

          if (response.status !== 200) {
            throw new Error("Invalid login credentials.");
          }

          user = response.data.data;
        }

        if (!user) return null;

        // Fetch the customer profile from the database
        const customerProfile = await prisma.customerProfile.findUnique({
          where: { userId: user.id },
        });

        console.log("User found:", { ...user, customerProfile });

        return { ...user, customerProfile };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }:any) {
      if (user) {
        console.log("Setting user data in JWT token:", user);

        token.id = user.id;
        token.email = user.email;
        token.isProfileComplete = user.isProfileComplete || false;
        token.customerProfile = user.customerProfile || null;
        token.verified = user.verified;
        token.resetToken = user.resetToken;
        token.resetTokenExpires = user.resetTokenExpires;
        token.isPasswordSet = user.isPasswordSet;
        token.role = user.role;
        token.loginType = user.loginType;
        token.token = user.token;
      }

      return token;
    },

    async session({ session, token }:any) {
      console.log("Attaching token data to session:", token);

      session.user.id = token.id;
      session.user.email = token.email;
      session.user.isProfileComplete = token.isProfileComplete;
      session.user.customerProfile = token.customerProfile || null;
      session.user.verified = token.verified;
      session.user.resetToken = token.resetToken;
      session.user.resetTokenExpires = token.resetTokenExpires;
      session.user.isPasswordSet = token.isPasswordSet;
      session.user.role = token.role;
      session.user.loginType = token.loginType;
      session.user.token = token.token;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
