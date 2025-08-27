"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import { truncateText } from "@/lib/truncateText";
import { Event, eventService } from "@/services/event";
import { participantService } from "@/services/participant";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { notify } from "@/data/global";

// custom Modal
import Modal from "@/components/ui/Modal";

export default function EventCard({
    event,
    view,
    index,
}: {
    event: Event;
    view: "grid" | "list";
    index: number;
}) {
    const user = useSelector((state: RootState) => state.auth.user);

    // Track participant status
    const [participantStatus, setParticipantStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE");
    const [loading, setLoading] = useState(false);

    // modal state
    const [openModal, setOpenModal] = useState(false);

    // Check participant status on mount
    useEffect(() => {
        if (event?.participants && user?.id) {
            const participant = event.participants.find((p) => p.userId === user.id);
            if (participant?.status === "PENDING") {
                setParticipantStatus("PENDING");
            } else if (participant) {
                setParticipantStatus("APPROVED");
            }
        }
    }, [event.participants, user?.id]);

    // Handle join event (after confirm in modal)
    const handleJoinEvent = async () => {
        try {
            setLoading(true);
            await participantService.join(event.id);

            // Refresh event
            const updatedEvent = await eventService.getById(event.id);

            const participant = updatedEvent.participants?.find((p) => p.userId === user?.id);
            if (participant?.status === "PENDING") {
                setParticipantStatus("PENDING");
            } else if (participant) {
                setParticipantStatus("APPROVED");
            }

            setOpenModal(false);
            notify("Request has been sent", "success");
        } catch (err) {
            console.error(err);
            notify("Failed to join the event", "error");
        } finally {
            setLoading(false);
        }
    };

    // Button label and disabled logic
    let joinLabel = "Join Now";
    let disabled = false;

    if (participantStatus === "PENDING") {
        joinLabel = "Request Pending";
        disabled = true;
    } else if (participantStatus === "APPROVED") {
        joinLabel = "Joined";
        disabled = true;
    }

    // Determine event status based on dates
    const getEventStatus = () => {
        const now = new Date();
        const startDate = new Date(event.startAt);
        const endDate = new Date(event.endAt);

        if (now < startDate) return "Upcoming";
        if (now > endDate) return "Past";
        return "Ongoing";
    };

    // Get badge color based on status/type
    const getBadgeColor = (type: string) => {
        switch (type) {
            case "Upcoming":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Ongoing":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "Past":
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
            case "ONSITE":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            case "ONLINE":
                return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
        }
    };

    const eventStatus = getEventStatus();

    return (
        <>
            <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition overflow-hidden ${view === "list" ? "flex" : "flex flex-col"
                    }`}
            >
                {/* Image Container with Badges */}
                <div className={`relative ${view === "list" ? "w-2/5" : "w-full"}`}>
                    <Image
                        src={event.thumbnail}
                        alt={event.title}
                        className={
                            view === "list"
                                ? "h-full w-full object-cover"
                                : "w-full h-40 object-cover"
                        }
                        width={400}
                        height={200}
                    />

                    {/* Badges Container - Top Right */}
                    <div className="absolute top-2 right-2 flex gap-2">
                        {/* Event Status Badge */}
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                                eventStatus
                            )}`}
                        >
                            {eventStatus.toUpperCase()}
                        </span>

                        {/* Event Type Badge */}
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                                event.type
                            )}`}
                        >
                            {event.type.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div
                    className={
                        view === "list" ? "w-3/5 p-5 flex flex-col" : "p-5 flex flex-col flex-1"
                    }
                >
                    <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex-1">
                        {truncateText(event.description, view === "list" ? 50 : 20)}
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

                    {/* Buttons */}
                    <div className={`mt-4 ${view === "list" ? "flex gap-3" : ""}`}>
                        <Button
                            onClick={() => (window.location.href = `/events/${event.id}`)}
                            variant="primary"
                            size="md"
                            className={view === "list" ? "flex-1" : "w-full"}
                        >
                            View Details
                        </Button>
                        {view === "list" && user?.role !== "ORGANIZER" && (
                            <Button
                                onClick={() => user ? setOpenModal(true) : window.location.href = '/login'}
                                variant="secondary"
                                size="md"
                                disabled={disabled}
                                className="flex-1"
                            >
                                {joinLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* --- Modal --- */}
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="Join Event"
                size="md"
                footer={
                    <>
                        <Button variant="warning" onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleJoinEvent}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Confirm"}
                        </Button>
                    </>
                }
            >
                <p>
                    Are you sure you want to join{" "}
                    <span className="font-semibold">{event.title}</span>?
                </p>
            </Modal>
        </>
    );
}
