"use server";

import { signIn } from "@/server/auth";
import { AuthError } from "next-auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    // Auth.js throws a redirect when sign-in succeeds — re-throw it so
    // Next.js actually performs the redirect.
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err;
    }
    if (err instanceof AuthError) {
      return { error: "Invalid email or password. Please try again." };
    }
    // Unexpected error
    return { error: "Something went wrong. Please try again later." };
  }
  return {};
}
