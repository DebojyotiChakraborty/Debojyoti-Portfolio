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
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
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
              <Link
                href="/touchgrass"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12 text-white dark:text-zinc-900 hover:bg-white/10 hover:text-white dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M6.356 3.235a1 1 0 0 1 1.168-.087c3.456 2.127 5.35 4.818 6.36 7.78.25.733.445 1.48.596 2.236 1.029-1.73 2.673-3.102 5.149-4.092a1 1 0 0 1 1.329 1.215l-.181.604C19.417 15.419 19 16.806 19 20a1 1 0 1 1-2 0c0-3.055.38-4.7 1.37-8.042-1.122.744-1.861 1.608-2.357 2.565C15.248 15.997 15 17.805 15 20a1 1 0 1 1-2 0c0-2.992-.13-5.847-1.009-8.427-.59-1.729-1.522-3.351-3.018-4.802C9.99 10.631 10 14.355 10 19.745V20a1 1 0 1 1-2 0c0-2.29-.01-4.371-.577-6.13-.326-1.013-.84-1.92-1.683-2.674C6.66 14.349 7 16.683 7 20a1 1 0 1 1-2 0c0-3.864-.472-6.255-1.949-10.684a1 1 0 0 1 1.32-1.244c1.395.557 2.455 1.301 3.255 2.18a24.109 24.109 0 0 0-1.554-5.88 1 1 0 0 1 .284-1.137" />
                </svg>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Touch Grass</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>

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
