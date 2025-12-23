import NextAuth from "next-auth"
import { buildNextAuthConfig, type RallyAuthConfig } from "@rally/auth"
import { prisma } from "./src/lib/db"

// Build Rally Auth configuration
const providers: RallyAuthConfig["providers"] = {}

// Add Google OAuth if credentials present
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.google = {
    type: "google",
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }
}

// Add Email auth if Resend key present
if (process.env.AUTH_RESEND_KEY) {
  providers.email = {
    server: {
      host: "smtp.resend.com",
      port: 465,
      auth: {
        user: "resend",
        pass: process.env.AUTH_RESEND_KEY,
      },
    },
    from: "The Toddfather <noreply@thetoddfather.com>",
  }
}

const rallyConfig = await buildNextAuthConfig({
  providers,

  // Simple tenancy - single tenant for now
  tenancy: {
    enabled: false,
  },

  // Map UserTier to role for RBAC compatibility
  rbac: {
    enabled: true,
    defaultRole: "USER",
    roles: ["ADMIN", "USER", "VIEWER"],
  },

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

  debug: process.env.NODE_ENV === "development",

  // Custom callbacks to maintain tier functionality
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
  },
}, prisma)

export const { handlers, auth, signIn, signOut } = NextAuth(rallyConfig)
