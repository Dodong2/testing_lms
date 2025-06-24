// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image?: string;
      role: "ADMIN" | "INSTRUCTOR" | "BENEFICIARY";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: "ADMIN" | "INSTRUCTOR" | "BENEFICIARY";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    picture?: string;
    role: "ADMIN" | "INSTRUCTOR" | "BENEFICIARY";
  }
}
