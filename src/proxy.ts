import NextAuth from "next-auth";
import { authConfig } from "@/server/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Match all /admin routes. The authorized() callback in authConfig
  // explicitly allows /admin/login and /api/auth/* through.
  matcher: ["/admin/:path*"],
};
