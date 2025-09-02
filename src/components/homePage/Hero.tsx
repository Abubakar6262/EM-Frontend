"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/assets/images/Hero.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
export default function Hero() {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <section className="relative bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-12  sm:py-24">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1"
                >
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Manage & Join Events Effortlessly
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-100">
                        A modern event management platform for organizers and participants.
                    </p>
                    <div className="mt-6 flex gap-4">
                        {
                            !user && <Link href="/signup">
                                <Button variant="primary" size="lg">Get Started</Button>
                            </Link>
                        }
                        <Link href="/about">
                            <Button variant="secondary" size="lg">Learn More</Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-1 flex justify-center"
                >
                    <Image
                        width={500}
                        height={500}
                        src={Banner}
                        alt="Event Management Illustration"
                        className="w-full max-w-md"
                    />
                </motion.div>
            </div>
        </section>
    );
}