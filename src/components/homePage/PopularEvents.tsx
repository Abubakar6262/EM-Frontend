"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, CalendarSearch, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { truncateText } from "@/lib/truncateText";
import { useEffect, useState } from "react";
import { Event, eventService } from "@/services/event";
import Link from "next/link";
import Loader from "../Loader";

export default function PopularEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await eventService.getAll();
                const topEvents = res.data
                    .sort(
                        (a, b) =>
                            (b.participants?.length ?? 0) -
                            (a.participants?.length ?? 0)
                    )
                    .slice(0, 4);
                setEvents(topEvents);
                console.log("events ", topEvents);
            } catch (err: unknown) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10">
                <Loader />
            </div>
        );
    }

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
                {events.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                    >
                        <CalendarSearch className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No Popular events found
                        </h3>
                    </motion.div>
                )}

                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{
                            scale: 1.05,
                            y: -5,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            },
                        }}
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
                                <Link href={`/events/${event.id}`}>
                                    <Button variant="primary" size="md" className="w-full">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
