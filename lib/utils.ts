import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const moveTooltip = (e: React.MouseEvent<HTMLElement>) => {
  const tooltip = document.getElementById("tooltip");
  if (tooltip) {
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY}px`;
  }
}; 