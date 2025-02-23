'use client';

import { FlipWords } from "@/components/ui/flip-words";

const ROLES = [
  "Student 📚",
  "Flutter App Developer 💻",
  "UI/UX Designer 🎨",
  "Gym Rat 🏋️"
];

export function CyclingText() {
  return (
    <FlipWords 
      words={ROLES}
      className="text-xl sm:text-2xl font-semibold"
      duration={3000}
    />
  );
} 