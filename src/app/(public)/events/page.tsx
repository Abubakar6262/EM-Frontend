"use client";
import { useState, useEffect } from "react";
import EventHeader from "@/components/eventPage/EventHeader";
import EventFilters from "@/components/eventPage/EventFilters";
import EventList from "@/components/eventPage/EventList";
import Pagination from "@/components/ui/Pagination";
import { motion } from "framer-motion";
import { CalendarSearch } from "lucide-react";
import { eventService, Event } from "@/services/event";
import Loader from "@/components/Loader";

export default function EventPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // API states
    const [events, setEvents] = useState<Event[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log(error)
    // Debounce the search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // reset to first page on new search
        }, 500); // wait 500ms after user stops typing

        return () => clearTimeout(handler); // cleanup previous timeout
    }, [search]);

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await eventService.getAll(
                    currentPage,
                    10,
                    statusFilter,
                    debouncedSearch, 
                    typeFilter
                );

                if (res.success === false || !res.data || res.data.length === 0) {
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
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentPage, debouncedSearch, statusFilter, typeFilter]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen p-6 space-y-8">
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
                    <EventList events={events} view={view} />
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
                        {debouncedSearch || typeFilter || statusFilter
                            ? "Try adjusting your search filters to find more events."
                            : "There are currently no events scheduled. Check back later for updates!"}
                    </p>
                </motion.div>
            )}
        </div>
    );
}
