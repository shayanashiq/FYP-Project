import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosResponse } from "axios";
import { ROLE } from "@/common/constant/apis-urls";
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
        console.log("credentials", credentials);
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials?.isSettingPassword === "true") {
          console.log(
            "credentials?.isSettingPassword",
            credentials?.isSettingPassword
          );
          try {
            const response = await fetch(
              "http://localhost:3000/api/password-save",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: credentials?.email,
                  newPassword: credentials?.password,
                  confirmPassword: credentials?.password,
                }),
              }
            );

            if (response.ok) {
              if (response.status === 200) {
                const result = await response.json();
                const user: any = result.data;
                console.log("set password >>>>>:::::", {
                  ...user,
                  customerProfile: null,
                });
                return {
                  ...user,
                  customerProfile: null,
                };
              }
              return null;
            }
            return null;
          } catch (err: any) {
            const message =
              err.response?.data?.message || "Login failed. Please try again.";
            console.error("❌ Error in login:", message);
            throw new Error(message); // You may want to replace with a generic error for security reasons.
          }
        } else if (credentials?.isSettingPassword === "false") {
          try {
            const response: AxiosResponse = await axios.post(
              "http://localhost:3000/api/login",
              {
                email: credentials?.email,
                password: credentials?.password,
                role: ROLE.CUSTOMER,
              }
            );
            console.log("Login response:", response);
            if (response.status === 200) {
              const user: any = response.data.data;
              // console.log("user>>>>>", user);
              return {
                ...user,
                customerProfile: user.customerProfile,
              };
            }
            return null;
          } catch (err: any) {
            const message =
              err.response?.data?.message || "Login failed. Please try again.";
            console.error("❌ Error in login:", message);
            throw new Error(message); // You may want to replace with a generic error for security reasons.
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update") {
        return {
          ...token,
          isProfileComplete: true,
          customerProfile: { ...session },
        };
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isProfileComplete = user.isProfileComplete || false;
        token.customerProfile = user.customerProfile || null;
        token.verified = user.verified;
        token.resetToken = user.resetToken;
        token.resetTokenExpires = user.resetTokenExpires;
        token.isPasswordSet = user.isPasswordSet;
        token.isProfileComplete = user.isProfileComplete;
        token.role = user.role;
        token.loginType = user.loginType;
        token.token = user.token;
      }

      return token;
    },

    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.name = token.name || null;
      session.user.image = token.image || null;
      session.user.email = token.email;
      session.user.isProfileComplete = token.isProfileComplete;
      session.user.customerProfile = token.customerProfile || null;
      session.user.verified = token.verified;
      session.user.resetToken = token.resetToken;
      session.user.resetTokenExpires = token.resetTokenExpires;
      session.user.isPasswordSet = token.isPasswordSet;
      session.user.isProfileComplete = token.isProfileComplete;
      session.user.role = token.role;
      session.user.loginType = token.loginType;
      session.user.token = token.token;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};