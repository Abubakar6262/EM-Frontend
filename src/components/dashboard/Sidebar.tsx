"use client";

import { motion } from "framer-motion";
import { X, CalendarPlus, List, LogOut } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { truncateText } from "@/lib/truncateText";

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    const [isDesktop, setIsDesktop] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    // Track screen size
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
        handleResize(); // run once
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sidebarItems = [
        { label: "Create Event", icon: CalendarPlus, href: "/dashboard/create-event" },
        { label: "My Events", icon: List, href: "/dashboard/events" },
    ];

    return (
        <motion.aside
            initial={false}
            animate={isDesktop ? { x: 0 } : { x: open ? 0 : -260 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-card border-r border-border p-4
               md:static md:h-auto z-40 md:z-auto"
        >
            {/* Top */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{truncateText(user?.fullName.toUpperCase() ?? "", 10)}</h2>
                {!isDesktop && (
                    <button className="md:hidden" onClick={onClose}>
                        <X className="h-6 w-6" />
                    </button>
                )}
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                    <Link key={item.label} href={item.href}>
                        <Button
                            variant="primary"
                            size="md"
                            className="w-full justify-start gap-2"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </nav>

            {/* Bottom */}
            <div className="mt-auto space-y-2">
                <span className=" md:hidden">
                    <ThemeToggle />
                </span>
                <Button variant="danger" size="md" className="w-full gap-2">
                    <LogOut className="h-5 w-5" /> Logout
                </Button>
            </div>
        </motion.aside>
    );
}
