"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="px-2 text-white dark:text-zinc-900 hover:bg-white/10 hover:text-white dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Icons.sun className="size-[1.125rem] dark:hidden" />
      <Icons.moon className="hidden size-[1.125rem] dark:block" />
    </Button>
  );
}
