import { cn } from "@/lib/utils";

export function DangerMeter({ level, className }: { level: 1 | 2 | 3; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`Danger level ${level} of 3`}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full",
            i <= level ? "bg-punch" : "bg-white/10"
          )}
        />
      ))}
    </span>
  );
}
