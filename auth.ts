import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/resend"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "./src/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    // GitHub OAuth
    ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
          }),
        ]
      : []),

    // Email authentication via Resend
    ...(process.env.AUTH_RESEND_KEY
      ? [
          EmailProvider({
            apiKey: process.env.AUTH_RESEND_KEY,
            from: process.env.AUTH_EMAIL_FROM || "The Syndicate Studio <onboarding@resend.dev>",
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },

  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string

        // Fetch user tier from database
        const user = await prisma.user.findUnique({
          where: { id: token.sub as string },
          select: { tier: true },
        })

        if (user) {
          session.user.tier = user.tier
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },

  debug: process.env.NODE_ENV === "development",
})
