"use client";

import { useEffect, useRef, useState } from "react";
import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { ResumeCard } from "@/components/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ScrollIsland from "@/components/ui/scroll-island";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { CyclingText } from "@/components/cycling-text";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const BLUR_FADE_DELAY = 0.04;

const SECTIONS = [
  { id: "hero", title: "Introduction" },
  { id: "about", title: "About" },
  { id: "education", title: "Education" },
  { id: "experience", title: "Experience" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
];

export default function Page() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Update ScrollTrigger on lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Set up RAF loop for smooth animations
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    const updateProgress = () => {
      const totalHeight = main.scrollHeight - window.innerHeight;
      const currentProgress = window.scrollY;
      const progressPercentage = (currentProgress / totalHeight) * 100;
      setScrollProgress(Math.min(Math.round(progressPercentage), 100));

      const sectionElements = SECTIONS
        .map(section => document.getElementById(section.id))
        .filter((element): element is HTMLElement => element !== null);

      if (sectionElements.length === 0) return;

      const currentSection = sectionElements.reduce((nearest, section) => {
        const distance = Math.abs(section.getBoundingClientRect().top - 100);
        const nearestDistance = nearest.getBoundingClientRect().top - 100;
        return Math.abs(distance) < Math.abs(nearestDistance) ? section : nearest;
      }, sectionElements[0]);

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial call
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element && lenisRef.current) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      lenisRef.current.scrollTo(elementPosition - offset, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  };

  return (
    <>
      {/* Progressive blur at the top */}
      <div className="fixed top-0 left-0 right-0 h-24 z-40 pointer-events-none">
        <div className="h-full bg-gradient-to-b from-background via-background/70 to-transparent" />
      </div>

      {mounted && (
        <ScrollIsland
          sections={SECTIONS}
          activeSection={activeSection}
          progress={scrollProgress}
          onSectionClick={handleSectionClick}
          isDarkMode={theme === "dark"}
        />
      )}

      <main ref={mainRef} className="flex flex-col min-h-[100dvh] space-y-10 pt-36 pb-16">
        <section id="hero">
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <div className="gap-6 flex items-start">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <Avatar className="size-28 border">
                  <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                  <AvatarFallback>{DATA.initials}</AvatarFallback>
                </Avatar>
              </BlurFade>
              <div className="flex-col flex flex-1 space-y-2">
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-3xl whitespace-nowrap font-bold tracking-tighter sm:text-4xl xl:text-5xl/none"
                  yOffset={8}
                  text={`Hi! I'm ${DATA.name} 👋`}
                />
                <CyclingText />
                <BlurFadeText
                  className="text-base text-muted-foreground/80"
                  delay={BLUR_FADE_DELAY}
                  text={DATA.description}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="about">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
              {DATA.summary}
            </Markdown>
          </BlurFade>
        </section>
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold">Education</h2>
            </BlurFade>
            {DATA.education.map((education, id) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 6 + id * 0.05}
              >
                <ResumeCard
                  key={education.school}
                  href={education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={education.degree}
                  period={`${education.start} - ${education.end}`}
                />
              </BlurFade>
            ))}
          </div>
        </section>
        <section id="experience">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold">Experience</h2>
            </BlurFade>
            {DATA.work.map((work, id) => (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 8 + id * 0.05}
              >
                <ResumeCard
                  key={work.company}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  badges={work.badges}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </BlurFade>
            ))}
          </div>
        </section>
        <section id="skills">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <h2 className="text-xl font-bold">Skills and Abilities</h2>
            </BlurFade>
            <div className="flex flex-col gap-6">
              {Object.entries(DATA.skillCategories).map(([category, skills], categoryIndex) => (
                <BlurFade 
                  key={category} 
                  delay={BLUR_FADE_DELAY * 10 + categoryIndex * 0.05}
                >
                  <div className="space-y-2">
                    <h3 className="text-lg">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, skillIndex) => (
                        <BlurFade
                          key={skill}
                          delay={BLUR_FADE_DELAY * 10 + categoryIndex * 0.05 + skillIndex * 0.02}
                        >
                          <div 
                            className="bg-black text-white px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
                          >
                            {skill}
                          </div>
                        </BlurFade>
                      ))}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
        <section id="projects">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <h2 className="text-xl font-bold">My Projects</h2>
              <p className="text-muted-foreground mt-1">
                I have worked on creating intuitive mobile apps as well as beautiful websites.
              </p>
            </BlurFade>
            
            <div className="flex flex-col gap-12">
              {DATA.projects.map((project, idx) => (
                <BlurFade
                  key={project.title}
                  delay={BLUR_FADE_DELAY * 12 + idx * 0.05}
                >
                  <div className="space-y-4 border rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <span className="text-muted-foreground text-sm">{project.dates}</span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm">
                      {project.description.split(' and ').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="text-foreground"> and </span>}
                        </span>
                      ))}
                    </p>

                    {'stats' in project && project.stats && (
                      <p className="text-sm text-muted-foreground">
                        Currently, it has over <span className="text-foreground">{project.stats.downloads} downloads</span> on the Play Store, with <span className="text-foreground">{project.stats.rating}</span>.
                      </p>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs text-muted-foreground border rounded px-2 py-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="aspect-[16/9] bg-muted rounded-xl overflow-hidden">
                      <div className="w-full h-full bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
        <section id="contact">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <p className="text-xl text-muted-foreground">
              Want to get in touch or hire me for a project?{" "}
              <br />
              Just shoot me a DM at{" "}
              <Link href={DATA.contact.social.X.url} className="text-foreground underline underline-offset-4">
                X
              </Link>
              {" "}or{" "}
              <Link href="#" className="text-foreground underline underline-offset-4">
                Telegram
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
