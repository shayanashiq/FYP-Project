// lib/auth-options.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { ROLE } from "@/common/constant/apis-urls";
import axios from "axios";

const prisma = new PrismaClient();

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          image: profile.picture,
          verified: true,
          loginType: "GOOGLE",
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSettingPassword: { label: "IsSettingPassword", type: "hidden" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          let user;
          if (credentials.isSettingPassword === "true") {
            const response = await fetch(
              `${process.env.NEXTAUTH_URL}/api/password-save`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: credentials.email,
                  newPassword: credentials.password,
                  confirmPassword: credentials.password,
                }),
              }
            );

            if (!response.ok) throw new Error("Failed to set password");
            user = (await response.json()).data;
          } else {
            const response = await axios.post(
              `${process.env.NEXTAUTH_URL}/api/login`,
              {
                email: credentials.email,
                password: credentials.password,
                role: ROLE.CUSTOMER,
              }
            );

            if (response.status !== 200) {
              throw new Error("Invalid credentials");
            }
            user = response.data.data;
          }

          if (!user) return null;

          const customerProfile = await prisma.customerProfile.findUnique({
            where: { userId: user.id },
          });

          return {
            ...user,
            customerProfile: customerProfile || null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if user exists in your database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user for Google sign-in
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              verified: true,
              loginType: "GOOGLE",
              role: ROLE.CUSTOMER,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          role: user.role || ROLE.CUSTOMER,
          loginType: account.provider === "google" ? "GOOGLE" : "CREDENTIALS",
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          role: token.role,
          loginType: token.loginType,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};