import Link from "next/link";
import { FlaskMark } from "@/components/FlaskMark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <FlaskMark className="h-6 w-6" />
          <span>
            Friend Trap <span className="text-teal">Lab</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main">
          <Link
            href="/stats"
            className="px-2 py-2 text-sm text-fog transition-colors hover:text-frost"
          >
            Stats
          </Link>
          <Link
            href="/make"
            className="btn-primary !min-h-9 !rounded-lg !px-4 !py-1.5 !text-sm"
          >
            Arm a trap
          </Link>
        </nav>
      </div>
    </header>
  );
}
