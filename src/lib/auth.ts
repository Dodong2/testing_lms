// src/lib/auth.ts
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

type ExtendedProfile = {
  picture?: string;
} & Record<string, unknown>;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email ?? undefined },
      });

      if (!existingUser) return false;

      const existingAccount = await prisma.account.findFirst({
        where: {
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
        },
      });

      if (!existingAccount && account) {
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            expires_at: account.expires_at,
            refresh_token: account.refresh_token,
          },
        });
      }

      return true;
    },
    async jwt({ token, user, profile}) {
      const ExtendedProfile = profile as ExtendedProfile
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image || ExtendedProfile?.picture
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name!;
        session.user.email = token.email!;
        session.user.image = token.picture;
        session.user.role = token.role!;
      }

      return session;
    },
  },
};





