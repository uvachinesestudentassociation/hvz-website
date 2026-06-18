import type React from "react";
import { Button } from "@/components/ui/button";

export function McButton({
  children,
  className = "",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={[
        "rounded-none border-4 border-[#8a7a68] bg-[#6b5d4f] text-[#f5f0e6] dark:border-neutral-400 dark:bg-neutral-900 dark:text-neutral-100",
        "shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.4),inset_4px_4px_0_0_rgba(255,255,255,0.25),6px_6px_0_rgba(0,0,0,0.45)] dark:shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.5),inset_4px_4px_0_0_rgba(255,255,255,0.15),6px_6px_0_rgba(255,255,255,0.08)]",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.45),inset_4px_4px_0_0_rgba(255,255,255,0.2),4px_4px_0_rgba(0,0,0,0.45)]",
        "font-mono tracking-tight uppercase min-h-[48px]",
        className,
      ].join(" ")}
    >
      {children}
    </Button>
  );
}
