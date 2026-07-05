import { ICON_DATA, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface LabIconProps {
  name: IconName;
  className?: string;
  /** Provide when the icon carries meaning on its own; omit for decoration. */
  label?: string;
}

/**
 * Renders a bundled Iconify icon as inline SVG. Hook-free, so it works
 * identically in server and client components with zero icon flash.
 */
export function LabIcon({ name, className, label }: LabIconProps) {
  const icon = ICON_DATA[name];
  const stroke = icon.mode === "stroke";
  return (
    <svg
      viewBox={icon.viewBox}
      className={cn("h-4 w-4 shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : undefined}
      strokeWidth={stroke ? 2 : undefined}
      strokeLinecap={stroke ? "round" : undefined}
      strokeLinejoin={stroke ? "round" : undefined}
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
