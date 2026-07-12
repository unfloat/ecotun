import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Applies to every /admin route, including /admin/login.
 * Deliberately does NOT check the session: the sign-in page lives under
 * /admin, so guarding here would redirect the sign-in page to itself.
 * The guard lives in the (queue) route group instead.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
