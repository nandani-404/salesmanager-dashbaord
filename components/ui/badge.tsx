import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled" | "default";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-yellow-100 text-yellow-800": variant === "pending",
          "bg-blue-100 text-blue-800": variant === "confirmed",
          "bg-purple-100 text-purple-800": variant === "in-transit",
          "bg-green-100 text-green-800": variant === "delivered",
          "bg-red-100 text-red-800": variant === "cancelled",
          "bg-gray-100 text-gray-800": variant === "default",
        },
        className
      )}
      {...props}
    />
  );
}
