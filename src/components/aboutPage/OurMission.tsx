"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import TeamImg from "@/assets/images/Hero.png";

export default function MissionSection() {
    return (
        <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <Image
                    src={TeamImg}
                    alt="Our Team"
                    className="rounded-2xl shadow-lg w-full"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4"
            >
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    At EventFlow, we believe in connecting people through experiences.
                    Our platform is designed to help organizers create impactful events
                    and participants engage effortlessly.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    From small workshops to large conferences, we simplify event planning
                    and participation with modern tools and beautiful design.
                </p>
            </motion.div>
        </section>
    );
}