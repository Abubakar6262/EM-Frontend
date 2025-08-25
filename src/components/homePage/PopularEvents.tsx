"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { popularEvents } from "@/data/popularEvents";
import { truncateText } from "@/lib/truncateText";



export default function PopularEvents() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* Section Title */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-center mb-10"
            >
                Popular Events
            </motion.h2>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularEvents.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                        <Image
                            src={event.thumbnail}
                            alt={event.title}
                            className="w-full h-40 object-cover"
                            width={400}
                            height={160}
                        />

                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-semibold text-lg line-clamp-1">
                                {event.title}
                            </h3>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex-1">
                                {truncateText(event.description, 20)}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(event.startAt).toLocaleDateString()} -{" "}
                                {new Date(event.endAt).toLocaleDateString()}
                            </div>

                            {event.venue && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate">{event.venue}</span>
                                </div>
                            )}

                            <div className="mt-4">
                                <Button variant="primary" size="md" className="w-full">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}