"use client";

import EventHeader from "@/components/eventPage/EventHeader";
import EventFilters from "@/components/eventPage/EventFilters";
import EventList from "@/components/eventPage/EventList";
import Pagination from "@/components/ui/Pagination";
import { motion } from "framer-motion";
import { CalendarSearch } from "lucide-react";
import { eventService, Event } from "@/services/event";
import { useState, useEffect } from "react";

export default function DashboardEvents() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // API states
    const [events, setEvents] = useState<Event[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState<string | null>(null);

    console.log(error);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setError(null);
                const res = await eventService.getMyEvents(
                    currentPage,
                    10,
                    statusFilter,
                    search,
                    typeFilter
                );

                if (!res.success || !res.data || res.data.length === 0) {
                    setEvents([]);
                    setTotalPages(1);
                } else {
                    setEvents(res.data);
                    setTotalPages(res.pagination.totalPages);
                }
            } catch (err: unknown) {
                setEvents([]);
                if (err instanceof Error) setError(err.message);
                else setError("Failed to load events");
            }
        };

        fetchEvents();
    }, [currentPage, search, statusFilter, typeFilter]);


    return (

        <div className="space-y-8 min-w-4xl">
            <EventHeader total={events.length} view={view} onToggle={setView} />

            <EventFilters
                search={search}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onTypeChange={setTypeFilter}
                onStatusChange={setStatusFilter}
            />

            {events.length > 0 ? (
                <>
                    <EventList events={events} view={view} onDeleteEvent={(id) => {
                        setEvents((prev) => prev.filter((e) => e.id !== id));
                    }} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <CalendarSearch className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No events found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        {search || typeFilter || statusFilter
                            ? "Try adjusting your search filters to find more events."
                            : "There are currently no events scheduled."}
                    </p>
                </motion.div>
            )}
        </div>
    )
}
