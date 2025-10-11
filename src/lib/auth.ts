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
  session: { strategy: "jwt" },
  pages: { error: "/error" },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      const email = user.email;
      const image = (profile as ExtendedProfile)?.picture || null;

      // Check if there are existing users in DB
      const userCount = await prisma.user.count();

      // Find or create the user
      let existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            name: user.name ?? "Unnamed User",
            email,
            image,
            role: userCount === 0 ? "ADMIN" : 'BENEFICIARY',
          },
        });
      } else {
        // Optional: update name or image if blank
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: existingUser.name || user.name || "Unnamed User",
            image: existingUser.image ?? image,
          },
        });
      }

      // 🔹 Ensure account exists
      if (account) {
        const existingAccount = await prisma.account.findFirst({
          where: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        });

        if (!existingAccount) {
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
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.email) return token;

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email as string },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.role = dbUser.role;
        token.name = dbUser.name;
        token.picture = dbUser.image ?? undefined;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};
