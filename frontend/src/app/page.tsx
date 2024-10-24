"use client";
import { HeroSection } from "@/components/hero-section";
import { NavbarHome } from "@/components/navbar";
import { div } from "framer-motion/client";

export default function Home() {
  return (
    <div>
      <NavbarHome />
      <HeroSection />
    </div>
  );
}
