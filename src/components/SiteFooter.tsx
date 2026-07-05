import Link from "next/link";
import { FlaskMark } from "@/components/FlaskMark";

const REPO_URL = "https://github.com/anessaiver/friend-trap-lab";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-semibold">
              <FlaskMark className="h-5 w-5" />
              Friend Trap Lab
            </div>
            <p className="mt-2 text-sm text-fog">
              A{" "}
              <a
                href="https://www.youtube.com/@DistilledScience"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:underline"
              >
                Distilled Science
              </a>{" "}
              experiment by Avisha NessAiver.
            </p>
            <p className="mt-1 font-mono text-xs text-fog/70">
              “Cite or it didn’t happen.”
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm"
            aria-label="Footer"
          >
            <Link href="/make" className="text-fog hover:text-frost">
              Arm a trap
            </Link>
            <Link href="/stats" className="text-fog hover:text-frost">
              Lab stats
            </Link>
            <Link href="/sources" className="text-fog hover:text-frost">
              Sources
            </Link>
            <Link href="/privacy" className="text-fog hover:text-frost">
              Privacy
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fog hover:text-frost"
            >
              GitHub repo
            </a>
          </nav>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-fog/60">
          This entire site was designed, built, and deployed by an AI in a
          single session — traps, roasts, database, and all. The prompt that
          did it is free by email. The science is real; the jellybean jar is
          not legally binding.
        </p>
      </div>
    </footer>
  );
}
