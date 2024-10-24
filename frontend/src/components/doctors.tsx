"use client";
import { WavyBackground } from "./ui/wavy-background";
import { AnimatedTooltip } from "./ui/animated-tooltip";

const healthcareExperts = [
  {
    id: 1,
    name: "Dr. Sarah Thompson",
    designation: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1591233780399-4c008db73f48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdG9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 2,
    name: "John Peterson",
    designation: "Physical Therapist",
    image:
      "https://images.unsplash.com/photo-1519794206461-77a6fe51c446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGh5c2ljYWwlMjB0aGVyYXBpc3R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Lisa Rodriguez",
    designation: "Nurse",
    image:
      "https://images.unsplash.com/photo-1573496011164-7807cbd9b71b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bnVyc2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Dr. Emily Johnson",
    designation: "General Practitioner",
    image:
      "https://images.unsplash.com/photo-1590581050925-1683c485cba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGVybWF0b2xvZ2lzdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
];

function HealthcareExperts() {
  return (
    <div className="relative h-[40rem] overflow-hidden flex items-center justify-center">
      <WavyBackground className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">
          Meet Our Healthcare Experts
        </h2>
        <p className="text-base md:text-lg text-white text-center mb-4">
          Learn more about the professionals who are revolutionizing patient
          care with technology
        </p>
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={healthcareExperts} />
        </div>
      </WavyBackground>
    </div>
  );
}

export default HealthcareExperts;
