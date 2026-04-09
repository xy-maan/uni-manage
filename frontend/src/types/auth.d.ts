import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    backendAccessToken: string
    backendRefreshToken: string
    backendError?: string
    user: {
      pk: number
      email: string
      first_name: string
      last_name: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string
    backendRefreshToken?: string
    backendError?: string
    user?: {
      pk: number
      email: string
      first_name: string
      last_name: string
    }
  }
}