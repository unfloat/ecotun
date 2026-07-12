import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign-in — ECOTUN",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Wordmark */}
        <div className="text-center">
          <span className="font-heading text-2xl font-700 text-primary" translate="no">
            ECOTUN
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card px-6 py-8 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold leading-tight text-foreground">
            Admin sign-in
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
