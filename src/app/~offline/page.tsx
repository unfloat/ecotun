import Link from "next/link";
import { WifiOff } from "lucide-react";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>

      <h1 className="font-heading text-2xl font-700 text-foreground sm:text-3xl">
        You&apos;re offline
      </h1>

      <p className="max-w-md text-base text-muted-foreground leading-relaxed">
        It looks like you&apos;ve lost your internet connection. Previously viewed pages
        may still be available — try navigating back to them.
      </p>

      <p className="max-w-sm text-sm text-muted-foreground">
        Once you&apos;re back online, this page will automatically reload.
      </p>

      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Go to home
      </Link>
    </div>
  );
}
