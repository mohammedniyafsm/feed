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
        const existingUser = await prisma.user.findFirst({
          where: { githubId: user.id },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              username: user.name ?? "Unknown User",
              email: user.email,
              image: user.image ?? "",
              githubId: user.id,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ? user.id.toString() : undefined;
        token.email = user.email ?? undefined;
        token.username = user.name ?? "Unknown User";
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
  pages : {
    signIn : '/sign-in'
  }
};