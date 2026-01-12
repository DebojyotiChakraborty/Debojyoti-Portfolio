import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";

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
  name: "Debojyoti",
  initials: "DB",
  url: "",
  location: "Durgapur, West Bengal",
  locationLink: "https://www.google.com/maps/place/durgapur",
  description: "I build beautiful mobile apps with design, code, and just enough caffeine. ☕️",
  summary: "I'm a Flutter developer and product builder who enjoys turning ideas into beautiful, usable, slightly over-engineered mobile apps. I spend most of my time thinking about how things should feel, animations, transitions, haptics, tiny details that make software feel alive.\n\nI've shipped multiple consumer apps used by thousands of people, including Radpapers (9,500+ downloads), and I'm currently building products like SnekID AI, Cartoonify AI, Span, and CareSync, from AI-powered utilities to calm, design-first tools.\n\nI like working where design meets engineering, obsessing over both the pixels and the code behind them.",
  avatarUrl: "/me_avatar.webp",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python",
    "Go",
    "Postgres",
    "Docker",
    "Kubernetes",
    "Java",
    "C++",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "hello@example.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/DebojyotiChakraborty",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/debojyoti-chakraborty-4b879a25a",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/Pseudo_Maverick",
        icon: Icons.x,
        navbar: true,
      },
      Telegram: {
        name: "Telegram",
        url: "https://t.me/Pseudo_Maverick",
        icon: Icons.telegram,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "StellarStudios",
      href: "https://bit.ly/StellarStudios_Android",
      badges: [],
      location: "",
      title: "Designer and Developer",
      logoUrl: "/stellarstudios.webp",
      start: "2021",
      end: "Present",
      description: "",
    },
    {
      company: "Independent Product Developer",
      href: "#",
      badges: [],
      location: "",
      title: "Designer and Developer",
      logoUrl: "/freelance.webp",
      start: "Jan 2022",
      end: "Present",
      description: "",
    },
  ],
  education: [
    {
      school: "Techno International New Town, Kolkata",
      href: "https://tint.edu.in",
      degree: "Bachelor of Technology in Computer Science",
      logoUrl: "/college.webp",
      start: "2022",
      end: "2026",
    },
    {
      school: "Amrita Vidyalayam, Durgapur",
      href: "https://amritaschool.edu.in/durgapur",
      degree: "CBSE     Class 1 - Class 12",
      logoUrl: "/school.webp",
      start: "2010",
      end: "2022",
    },
  ],
  projects: [
    {
      title: "snekID - AI Snake Identifier",
      href: "#",
      dates: "Under Development",
      description: "An AI-powered mobile app that identifies snake species using advanced machine learning models. Built with Flutter and integrated with multimodal AI APIs for accurate snake identification.",
      images: ["/snekid.webp"],
      technologies: ["Flutter", "Gemini API", "Vision models", "AI"]
    } satisfies Project,
    {
      title: "Span - Minimalist Time Visualizer",
      href: "#",
      dates: "Under Development",
      description: "A minimalist time visualization app that helps users understand and manage their time better through beautiful, intuitive visualizations. Designed with a focus on simplicity and user experience.",
      images: ["/span.webp"],
      technologies: ["Flutter", "Design", "UI/UX"]
    } satisfies Project,
    {
      title: "CareSync - Biometric Authenticated Medical Logging System",
      href: "https://github.com/DebojyotiChakraborty/CareSync",
      dates: "November 2025 - Present",
      description: "A secure medical logging system with biometric authentication, ensuring patient data privacy and security. Built for healthcare professionals and patients to maintain accurate and secure medical records with the highest standards of data protection. Includes roles for Patients, Doctors, Pharmacists and even first responders.",
      images: ["/caresync.webp"],
      technologies: ["Flutter", "Biometric Auth", "Security", "Healthcare", "Supabase"]
    } satisfies Project,
    {
      title: "Cartoonify AI - Photo to Cartoon",
      href: "#",
      dates: "March 2025 - Present",
      description: "An AI-powered app that transforms photos into cartoon-style images using advanced image generation models. Features intuitive UI and high-quality cartoon transformations.",
      images: ["/cartoonifyai.webp"],
      technologies: ["Flutter", "AI", "Image Generation", "Gemini API"]
    } satisfies Project,
    {
      title: "Dewanjee.in",
      href: "https://dewanjee.in/",
      dates: "July 2025 - August 2025",
      description: "A utilitarian web page I created for a local business that delivers furniture, steel products and services like interior makeovers.",
      images: ["/dewanjee.webp"],
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"]
    } satisfies Project,
    {
      title: "Radpapers - 4K, HD Wallpapers",
      href: "https://play.google.com/store/apps/details?id=com.debojyoti.radpapers",
      dates: "May 2024 - Present",
      description: "A beautiful wallpaper app with tons of beautiful ai-generated, human-edited wallpapers. I have designed the entire app, screens, flows, animations and micro-interactions. Developed it using Flutter, Google Firebase and GitHub. Currently, it has over 9500+ downloads on the Play Store, with 4.2 stars rating. iOS version of the app is currently under development and would be out soon!",
      images: ["/radpapers_app.webp"],
      technologies: ["Flutter", "Firebase", "GitHub"],
      stats: {
        downloads: "9500+",
        rating: "4.2 stars"
      }
    } satisfies Project,
    {
      title: "radpapers.in",
      href: "https://radpapers.in/",
      dates: "Sept 2024 - Oct 2024",
      description: "A responsive landing page for the Radpapers App which I designed and developed using Next.js, TailwindCSS, TypeScript.",
      images: ["/radpapers_website.webp"],
      technologies: ["Next.js", "TailwindCSS", "TypeScript"]
    } satisfies Project,
    {
      title: "OrbitAI - Image Generator",
      href: "#",
      dates: "Nov 2024 - Jan 2025",
      description: "A modern AI Image Generator App which I designed as a freelance project, taking inspiration from Apple&apos;s new Spatial Design in the Vision Pro. I designed the screens, flows, app-icon and interactive onboarding.",
      images: ["/orbitai.webp"],
      technologies: ["Flutter", "Spatial Design", "Vision Pro"]
    } satisfies Project,
    {
      title: "WhatsBuddy - WhatsApp Utility",
      href: "https://github.com/DebojyotiChakraborty/WhatsBuddy",
      dates: "Nov 2024 - Jan 2025",
      description: "WhatsBuddy is a lightweight and open-source WhatsApp utility app that helps you keep your contact list clean and tidy by letting you message people without saving their phone number on your device or add them to temporary contacts which are automatically deleted after 24 hours. It also lets you save your Status media you have seen on your device or share it directly to other social media. Built using Flutter, Riverpod, Clean Architecture and Hive.",
      images: ["/whatsbuddy.webp"],
      technologies: ["Flutter", "Riverpod", "Clean Architecture", "Hive"]
    } satisfies Project,
  ] as const satisfies readonly Project[],
  skillCategories: {
    "Core Stack": ["Flutter", "Dart", "Kotlin", "Swift", "TypeScript"],
    "Frontend & UI": ["Flutter", "React", "Next.js", "Tailwind CSS"],
    "Backend & Data": ["Firebase", "Supabase", "REST APIs", "MongoDB", "MySQL"],
    "AI APIs & Multimodal Models": ["Gemini API", "Vision models", "Image generation", "Multimodal LLMs", "Prompt design for inference"],
    "Design & Tools": ["Figma", "Photoshop", "Illustrator", "Git", "Xcode", "Android Studio"],
  },
} as const;
