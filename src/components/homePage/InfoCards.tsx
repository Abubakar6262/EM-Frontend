"use client";

import { motion } from "framer-motion";
import { features } from "@/data/features";

export default function InfoCards() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-0 sm:px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    Why Choose EventHub?
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                    We provide everything you need to organize and attend events smoothly.
                </p>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.2 }}
                                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition"
                            >
                                <div className="flex justify-center mb-4">
                                    <Icon className={f.iconClass} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">{f.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}