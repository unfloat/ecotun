import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/server/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — ECOTUN",
  robots: { index: false, follow: false },
};

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      {/* Skip to main */}
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to content
      </a>

      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Wordmark + context */}
          <div className="flex items-center gap-3">
            <span className="font-heading text-xl font-700 text-primary" translate="no">
              ECOTUN
            </span>
            <span className="text-muted-foreground text-sm font-medium hidden sm:inline">
              / Admin
            </span>
          </div>

          {/* Right: public site link + sign out */}
          <nav aria-label="Admin navigation" className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              ← Public site
            </Link>

            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex min-h-[44px] items-center rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main id="admin-main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
