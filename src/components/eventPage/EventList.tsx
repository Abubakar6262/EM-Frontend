"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/services/event"; 

interface EventListProps {
    events: Event[];
    view: "grid" | "list";
    onDeleteEvent?: (id: string) => void;
}

export default function EventList({ events, view, onDeleteEvent }: EventListProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize(); // run once on mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const activeView = isMobile ? "grid" : view;

    return (
        <div
            className={
                activeView === "grid"
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
            }
        >
            {events.map((event, i) => (
                <EventCard key={event.id} event={event} view={activeView} index={i} onDeleteEvent={onDeleteEvent} />
            ))}
        </div>
    );
}
