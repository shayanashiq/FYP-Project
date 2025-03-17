import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    isProfileComplete?: boolean;
    customerProfile?: any;
    verified?: boolean;
    resetToken?: string;
    resetTokenExpires?: string;
    isPasswordSet?: boolean;
    role?: string;
    loginType?: string;
    token?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    isProfileComplete?: boolean;
    customerProfile?: any;
    verified?: boolean;
    resetToken?: string;
    resetTokenExpires?: string;
    isPasswordSet?: boolean;
    role?: string;
    loginType?: string;
    token?: string;
  }
}
