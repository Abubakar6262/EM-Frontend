"use client";

import HeroSection from "@/components/aboutPage/HeroSection";
import MissionSection from "@/components/aboutPage/OurMission";
import ValuesSection from "@/components/aboutPage/OurValue";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <HeroSection />
            <MissionSection />
            <ValuesSection />
        </div>
    );
}