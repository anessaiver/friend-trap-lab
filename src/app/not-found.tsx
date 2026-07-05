import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <div className="font-mono text-sm tracking-[0.3em] text-punch">ERROR 404</div>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">
        This page is a false memory.
      </h1>
      <p className="mt-4 text-fog">
        You remember it vividly. You're certain it existed. The lab has no
        record of it — which, if anything, proves the point of this website.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Return to the lab
        </Link>
        <Link href="/make" className="btn-ghost">
          Arm a trap instead
        </Link>
      </div>
    </div>
  );
}
