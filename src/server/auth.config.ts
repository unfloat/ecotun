import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth configuration (no Node.js-only imports).
 * Used by middleware to validate JWT sessions.
 * The Credentials provider's authorize function is only needed at
 * sign-in time (Node.js runtime); middleware only checks the JWT.
 */
export const authConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      // Allow the login page and NextAuth API routes through unauthenticated
      if (
        pathname === "/admin/login" ||
        pathname.startsWith("/api/auth/")
      ) {
        return true;
      }
      // All other /admin/* paths require a valid session
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
