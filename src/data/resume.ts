type Project = {
  title: string;
  href: string;
  dates: string;
  description: string;
  images: string[];
  technologies: string[];
  stats?: {
    downloads: string;
    rating: string;
  };
};

export const DATA = {
  projects: [
    {
      title: "Radpapers - 4K, HD Wallpapers",
      href: "#",
      dates: "May 2024 - Present",
      description: "A beautiful wallpaper app with tons of beautiful ai-generated, human-edited wallpapers. I have designed the entire app, screens, flows, animations and micro-interactions. Developed it using Flutter, Google Firebase and GitHub. Currently, it has over 9500+ downloads on the Play Store, with 4.2 stars rating. iOS version of the app is currently under development and should be out soon!",
      images: ["/radpapers-1.png"],
      technologies: ["Flutter", "Firebase", "GitHub"],
      stats: {
        downloads: "9500+",
        rating: "4.2 stars"
      }
    },
    {
      title: "radpapers.in",
      href: "#",
      dates: "Sept 2024 - Oct 2024",
      description: "A responsive landing page for the Radpapers App which I designed and developed using Next.js, TailwindCSS, TypeScript.",
      images: ["/radpapers-web.png"],
      technologies: ["Next.js", "TailwindCSS", "TypeScript"]
    },
    {
      title: "OrbitAI - Image Generator",
      href: "#",
      dates: "Nov 2024 - Jan 2025",
      description: "A modern AI Image Generator App which I designed as a freelance project, taking inspiration from Apple's new Spatial Design in the Vision Pro. I designed the screens, flows, app-icon and interactive onboarding.",
      images: ["/orbit-ai.png"],
      technologies: ["Flutter", "Spatial Design", "Vision Pro"]
    },
    {
      title: "WhatsBuddy - WhatsApp Utility",
      href: "#",
      dates: "Nov 2024 - Jan 2025",
      description: "WhatsBuddy is a lightweight and open-source WhatsApp utility app that helps you keep your contact list clean and tidy by letting you message people without saving their phone number to your device or add them to temporary contacts which are automatically deleted after 24 hours. It also lets you save any Status media you have viewed, to your device or even share it directly to social media. Built using Flutter, Riverpod, Clean Architecture and Hive.",
      images: ["/whatsbuddy-1.png"],
      technologies: ["Flutter", "Riverpod", "Clean Architecture", "Hive"]
    }
  ] as const satisfies readonly Project[]
} 