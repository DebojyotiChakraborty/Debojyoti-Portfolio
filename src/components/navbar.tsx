import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "@/components/icons";

export default function Navbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-zinc-900 dark:bg-white transform-gpu border border-white/20 dark:border-zinc-900/20">
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12 text-white dark:text-zinc-900 hover:bg-white/10 hover:text-white dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
                )}
              >
                <Icons.document className="size-[1.125rem]" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resume</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>

        <Separator orientation="vertical" className="h-full opacity-20" />

        {Object.entries(DATA.contact.social)
          .filter(([_, social]) => social.navbar)
          .map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={social.url}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 text-white dark:text-zinc-900 hover:bg-white/10 hover:text-white dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
                    )}
                  >
                    <social.icon className="size-[1.125rem]" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

        <Separator orientation="vertical" className="h-full opacity-20" />

        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </div>
  );
}
