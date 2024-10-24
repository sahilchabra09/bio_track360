import { HoverEffect } from "./ui/card-hover-effect";
import {
  IconHeartbeat,
  IconTemperature,
  IconLungs,
  IconMoonStars,
} from "@tabler/icons-react"; // Tabler icons

export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={healthData} />
    </div>
  );
}

// Updated health-related data
export const healthData = [
  {
    title: "Heart Rate (ECG)",
    description: "View your real-time heart rate and ECG data.",
    link: "#", // You can update this with actual links later
    icon: <IconHeartbeat className="h-24 w-24 text-red-500" />, // Large icon
  },
  {
    title: "Temperature",
    description: "Monitor your body temperature accurately.",
    link: "#",
    icon: <IconTemperature className="h-24 w-24 text-orange-500" />, // Large icon
  },
  {
    title: "Oxygen Content",
    description: "Track your blood oxygen levels effectively.",
    link: "#",
    icon: <IconLungs className="h-24 w-24 text-blue-500" />, // Large icon
  },
  {
    title: "Sleep Data",
    description: "Analyze your sleep patterns and quality.",
    link: "#",
    icon: <IconMoonStars className="h-24 w-24 text-purple-500" />, // Large icon
  },
];
