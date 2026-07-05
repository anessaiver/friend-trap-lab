"use client";

import { useEffect, useState } from "react";
import { LabIcon } from "@/components/LabIcon";

interface SharePanelProps {
  url: string;
  text: string;
  title?: string;
  copyTextLabel?: string;
}

export function SharePanel({ url, text, title = "Friend Trap Lab", copyTextLabel = "Copy result text" }: SharePanelProps) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState<"" | "link" | "text">("");

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(""), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // user cancelled — no drama
    }
  }

  async function copy(payload: string, kind: "link" | "text") {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(kind);
    } catch {
      // clipboard blocked; select-and-copy fallback below
      window.prompt("Copy this:", payload);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className="btn-primary flex-1 sm:flex-none">
          <LabIcon name="share" />
          Share
        </button>
      )}
      <button type="button" onClick={() => copy(url, "link")} className="btn-ghost flex-1 sm:flex-none">
        <LabIcon name={copied === "link" ? "check" : "link"} className={copied === "link" ? "h-4 w-4 text-teal" : undefined} />
        {copied === "link" ? "Link copied" : "Copy link"}
      </button>
      <button type="button" onClick={() => copy(text, "text")} className="btn-ghost flex-1 sm:flex-none">
        <LabIcon name={copied === "text" ? "check" : "copy"} className={copied === "text" ? "h-4 w-4 text-teal" : undefined} />
        {copied === "text" ? "Text copied" : copyTextLabel}
      </button>
    </div>
  );
}
