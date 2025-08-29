"use client";

import { motion } from "framer-motion";

export default function ValuesSection() {
    const values = [
        {
            title: "Simplicity",
            desc: "Easy-to-use platform for organizers and participants alike.",
        },
        {
            title: "Reliability",
            desc: "Secure and scalable infrastructure you can count on.",
        },
        {
            title: "Community",
            desc: "Events are about people, and we put people first.",
        },
    ];

    return (
        <section className="bg-white dark:bg-gray-800 py-16">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-12">Our Values</h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {values.map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="p-6 bg-gray-100 dark:bg-gray-700 rounded-2xl shadow hover:shadow-lg"
                        >
                            <h3 className="text-xl font-semibold mb-3">{val.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{val.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}