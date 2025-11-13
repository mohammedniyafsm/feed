import { prisma } from "@/lib/prisma";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        let existingUser = await prisma.user.findFirst({
          where: { githubId: user.id },
        })

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              username: user.name ?? "Unknown User",
              email: user.email,
              image: user.image ?? "",
              githubId: user.id?.toString() ?? "",
            },
          });
        }

        (user as any).dbId = existingUser.id;
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).dbId ?? token.id;
        token.email = user.email ?? undefined;
        token.username = user.name ?? "Unknown User";
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) token.id = dbUser.id;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username ?? "Unknown User";
      }
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
