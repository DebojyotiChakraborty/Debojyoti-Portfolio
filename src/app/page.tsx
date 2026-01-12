"use client";

import { useEffect, useRef, useState } from "react";
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
import Lenis from 'lenis'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LinkPreview } from "@/components/LinkPreview";
import Image from "next/image";
import { ImageMagnifier } from "@/components/ui/image-magnifier";

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

  // Ensure we have a theme value (fallback to 'light' if not available)
  const currentTheme = theme || 'light';

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
          isDarkMode={currentTheme === "dark"}
        />
      )}

      <main ref={mainRef} className="flex flex-col min-h-[100dvh] space-y-24 pt-24 pb-16">
        <section id="hero">
          <div className="mx-auto w-full max-w-2xl space-y-6">
            <div className="gap-6 flex items-start">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <Avatar className="size-32 border">
                  <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                  <AvatarFallback>{DATA.initials}</AvatarFallback>
                </Avatar>
              </BlurFade>
              <div className="flex-col flex flex-1 space-y-1">
                <BlurFadeText
                  delay={BLUR_FADE_DELAY}
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none whitespace-normal sm:whitespace-nowrap"
                  yOffset={8}
                  text={`Hi! I'm ${DATA.name}\u00A0👋`}
                />
                <BlurFade delay={BLUR_FADE_DELAY}>
                  <CyclingText />
                </BlurFade>
                <BlurFadeText
                  className="text-base text-muted-foreground/80 font-medium mt-1"
                  delay={BLUR_FADE_DELAY}
                  text={DATA.description}
                />
              </div>
            </div>
          </div>
        </section>
        <section id="about">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold font-sans">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <Markdown className="prose max-w-full text-pretty text-sm text-muted-foreground dark:prose-invert font-medium">
              {DATA.summary}
            </Markdown>
          </BlurFade>
        </section>
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold font-sans">Education</h2>
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
              <h2 className="text-xl font-bold font-sans">Experience</h2>
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
              <h2 className="text-xl font-bold font-sans">Skills and Abilities</h2>
            </BlurFade>
            <div className="flex flex-col gap-2">
              {Object.entries(DATA.skillCategories).map(([category, skills], categoryIndex) => (
                <BlurFade
                  key={category}
                  delay={BLUR_FADE_DELAY * 10 + categoryIndex * 0.05}
                >
                  <div className="space-y-1.5">
                    <h3 className="font-medium font-sans text-xs sm:text-sm">{category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, skillIndex) => (
                        <BlurFade
                          key={skill}
                          delay={BLUR_FADE_DELAY * 10 + categoryIndex * 0.05 + skillIndex * 0.02}
                        >
                          <div
                            className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-xs sm:text-sm font-normal"
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
              <h2 className="text-xl font-bold font-sans">My Projects</h2>
              <p className="text-sm text-muted-foreground mt-1 font-medium font-sans">
                Here are some of the projects I have worked on.
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
                      <LinkPreview
                        url={project.href}
                        width={320}
                        height={180}
                      >
                        <h3 className="text-sm font-medium hover:text-primary transition-colors">{project.title}</h3>
                      </LinkPreview>
                      <span className="text-muted-foreground text-sm">{project.dates}</span>
                    </div>

                    <div className="prose max-w-full text-pretty text-sm text-muted-foreground dark:prose-invert font-medium">
                      <p>
                        {project.title === "snekID - AI Snake Identifier" && (
                          <>
                            An <span className="text-foreground">AI-powered app</span> that lets users take pictures of snakes they might encounter and <span className="text-foreground">identifies the snake species</span> using the <span className="text-foreground">Gemini API</span> and displays all necessary information like <span className="text-foreground">Danger/Venom Level</span>, <span className="text-foreground">Behaviour</span>, <span className="text-foreground">Places of Origin</span>, <span className="text-foreground">Safety tips</span> etc.
                          </>
                        )}

                        {project.title === "Span - Minimalist Time Visualizer" && (
                          <>
                            A <span className="text-foreground">minimalist time visualization app</span> that helps users understand and manage their time better through <span className="text-foreground">beautiful, intuitive visualizations</span>. Designed with a focus on <span className="text-foreground">simplicity</span> and <span className="text-foreground">user experience</span>, making time management both functional and visually appealing.
                          </>
                        )}

                        {project.title === "CareSync - Biometric Authenticated Medical Logging System" && (
                          <>
                            A <span className="text-foreground">secure medical logging system</span> with <span className="text-foreground">biometric authentication</span>, ensuring <span className="text-foreground">patient data privacy and security</span>. Built for <span className="text-foreground">healthcare professionals and patients</span> to maintain <span className="text-foreground">accurate and secure medical records</span> with the highest standards of data protection. Includes <span className="text-foreground">roles for Patients, Doctors, Pharmacists and even first responders</span>.
                          </>
                        )}

                        {project.title === "Cartoonify AI - Photo to Cartoon" && (
                          <>
                            A fun <span className="text-foreground">AI-powered app</span> that transforms user photos into <span className="text-foreground">cartoon-style images</span> using <span className="text-foreground">Gemini Nano Banana image model</span>. Features <span className="text-foreground">intuitive UI</span> and <span className="text-foreground">high-quality cartoon transformations</span>, making it easy for users to create fun, artistic versions of their photos. Includes <span className="text-foreground">art styles</span> from many popular cartoon and anime.
                          </>
                        )}

                        {project.title === "Dewanjee.in" && (
                          <>
                            A <span className="text-foreground">utilitarian web page</span> I created for a local business that delivers <span className="text-foreground">furniture</span>, <span className="text-foreground">steel products</span> and services like <span className="text-foreground">interior makeovers</span>. Built using <span className="text-foreground">Next.js</span>, <span className="text-foreground">TypeScript</span>, and <span className="text-foreground">Tailwind CSS</span> to provide a clean and professional online presence.
                          </>
                        )}

                        {project.title === "radpapers.in" && (
                          <>
                            A <span className="text-foreground">responsive landing</span> page for the Radpapers App which I designed and developed using <span className="text-foreground">Next.js</span>, <span className="text-foreground">TailwindCSS</span>, <span className="text-foreground">TypeScript</span>.
                          </>
                        )}

                        {project.title === "OrbitAI - Image Generator" && (
                          <>
                            A modern <span className="text-foreground">AI Image Generator</span> App which I designed as a freelance project, taking inspiration from Apple&apos;s new <span className="text-foreground">Spatial Design</span> in the Vision Pro. I designed the <span className="text-foreground">screens</span>, <span className="text-foreground">flows</span>, <span className="text-foreground">app-icon</span> and <span className="text-foreground">interactive onboarding</span>.
                          </>
                        )}

                        {project.title === "WhatsBuddy - WhatsApp Utility" && (
                          <>
                            WhatsBuddy is a <span className="text-foreground">lightweight</span> and <span className="text-foreground">open-source</span> WhatsApp utility app that helps you keep your <span className="text-foreground">contact list clean and tidy</span> by letting you message people <span className="text-foreground">without saving their phone number</span> to your device or add them to <span className="text-foreground">temporary contacts</span> which are automatically deleted after 24 hours. It also lets you save any <span className="text-foreground">Status media</span> you have viewed, to your device or even share it directly to social media. Built using <span className="text-foreground">Flutter</span>, <span className="text-foreground">Riverpod</span>, <span className="text-foreground">Clean Architecture</span> and <span className="text-foreground">Hive</span>.
                          </>
                        )}

                        {project.title === "Radpapers - 4K, HD Wallpapers" && (
                          <>
                            A beautiful wallpaper app with tons of beautiful ai-generated, human-edited wallpapers. I have designed the entire app, <span className="text-foreground">screens</span>, <span className="text-foreground">flows</span>, <span className="text-foreground">animations</span> and <span className="text-foreground">micro-interactions</span>. Developed it using <span className="text-foreground">Flutter</span>, <span className="text-foreground">Google Firebase</span> and <span className="text-foreground">GitHub</span>. Currently, it has over <span className="text-foreground">9500+ downloads</span> on the Play Store, with <span className="text-foreground">4.2 stars rating</span>. iOS version of the app is currently under development and should be out soon!
                          </>
                        )}

                        {!["snekID - AI Snake Identifier", "Span - Minimalist Time Visualizer", "CareSync - Biometric Authenticated Medical Logging System", "Cartoonify AI - Photo to Cartoon", "Dewanjee.in", "radpapers.in", "OrbitAI - Image Generator", "WhatsBuddy - WhatsApp Utility", "Radpapers - 4K, HD Wallpapers"].includes(project.title) && (
                          <>{project.description}</>
                        )}
                      </p>

                      {'stats' in project && project.stats && project.title !== "Radpapers - 4K, HD Wallpapers" && (
                        <p className="text-sm text-muted-foreground">
                          Currently, it has over <span className="text-foreground">{project.stats.downloads}</span> on the Play Store, with <span className="text-foreground">{project.stats.rating}</span>.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-xs sm:text-sm font-normal"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="w-full rounded-xl overflow-hidden">
                      <div className="relative w-full">
                        <ImageMagnifier
                          src={project.images[0]}
                          alt={project.title}
                          width={1920}
                          height={1080}
                          magnifierSize={300}
                          zoomLevel={4}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
        <section id="contact">
          <div className="flex flex-col items-start gap-4">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <h2 className="text-xl font-bold font-sans">Contact</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 14}>
              <p className="text-sm text-muted-foreground font-medium">
                Want to get in touch or hire me for a project?{" "}
                <br />
                Just shoot me a DM on{" "}
                <Link href={DATA.contact.social.X.url} className="text-foreground underline underline-offset-4">
                  X
                </Link>
                {" "}or{" "}
                <Link href={DATA.contact.social.Telegram.url} className="text-foreground underline underline-offset-4">
                  Telegram
                </Link>
              </p>
            </BlurFade>
          </div>
        </section>
      </main>
    </>
  );
}
