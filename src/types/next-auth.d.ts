import { UserTier } from "../generated/prisma"
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      tier: UserTier
    }
  }

  interface User {
    tier: UserTier
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
  }
}
