"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { truncateText } from "@/lib/truncateText";
import { Event, eventService, Host } from "@/services/event";
import { participantService } from "@/services/participant";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { notify } from "@/data/global";

// custom Modal
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import EventForm from "../event/EventForm";
import { formatDateTimeLocal, handleApiError } from "@/lib/utils";
import ThankYouModal from "../ui/ThankYouModal";

export default function EventCard({
    event,
    view,
    index,
    onDeleteEvent,
    onEventUpdated,
}: {
    event: Event;
    view: "grid" | "list";
    index: number;
    onDeleteEvent?: (id: string) => void;
    onEventUpdated?: () => void;
}) {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    // Track participant status
    const [participantStatus, setParticipantStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE");
    const [loading, setLoading] = useState(false);

    // modal state
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openThankYouModal, setOpenThankYouModal] = useState(false);



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
            setOpenThankYouModal(true);
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
    // Extra conditions: event is past OR seats are full
    if (new Date(event.endAt) < new Date()) {
        joinLabel = "Event Ended";
        disabled = true;
    } else if (event.totalSeats && event.confirmedCount >= event.totalSeats) {
        joinLabel = "Seats Full";
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

    const handleDelete = async () => {
        try {
            await eventService.deleteEvent(event.id);
            notify("Event deleted successfully", "success");
            setOpenDeleteModal(false);
            if (onDeleteEvent) onDeleteEvent(event.id);
        } catch (error) {
            handleApiError(error);
        }
    };


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
                                ? "w-full object-cover max-h-[300px]"
                                : "w-full h-40 object-cover"
                        }
                        width={400}
                        height={200}
                    />

                    {/* Badges Container - Top Left */}
                    {user?.role === "ORGANIZER" &&
                        <div className="absolute top-2 left-2 flex gap-2" title="Delete Event" aria-label="Delete Event" onClick={() => setOpenDeleteModal(true)}>
                            <span className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 p-1 rounded-full hover:bg-red-200 hover:dark:bg-red-800 transition">
                                <Trash2 className="w-6 h-6 text-red-500 cursor-pointer" />
                            </span>
                        </div>
                    }
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
                    {/* Seat Availability Slider */}
                    {event.totalSeats && event.totalSeats >= 1 && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-300">
                                    Seats Filled
                                </span>
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                    {event.confirmedCount} / {event.totalSeats}
                                </span>
                            </div>

                            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(event.confirmedCount / event.totalSeats) * 100}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    )}

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
                    <div className={`mt-4 ${view === "list" || user?.role === "ORGANIZER" ? "flex gap-3" : ""}`}>
                        <Button
                            onClick={user?.role !== "ORGANIZER" ? () => (router.push(`/events/${event.id}`)) : () => (router.push(`my-events/${event.id}`))}
                            variant="primary"
                            size="md"
                            className={view === "list" ? "flex-1" : "w-full"}
                        >
                            View Details
                        </Button>
                        {user?.role === "ORGANIZER" && (
                            <Button
                                onClick={() => setOpenEditModal(true)}
                                variant="secondary"
                                size="md"
                                className={view === "list" ? "flex-1" : "w-full"}
                            >
                                Edit Event
                            </Button>
                        )}
                        {view === "list" && user?.role !== "ORGANIZER" && (
                            <Button
                                onClick={() => user ? setOpenModal(true) : router.push('/login')}
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

            {/* Edit Modal */}
            <Modal
                isOpen={openEditModal}
                onClose={() => setOpenEditModal(false)}
                title="Edit Event"
                size="xl"
            >
                <EventForm
                    initialValues={{
                        title: event.title ?? "",
                        description: event.description ?? "",
                        hosts: Array.isArray(event.hosts)
                            ? event.hosts.map((host: Host) => ({
                                name: host.name ?? "",
                                email: host.email ?? "",
                            }))
                            : [{ name: "", email: "" }],
                        type:
                            event.type === "ONLINE" || event.type === "ONSITE"
                                ? event.type
                                : "ONSITE",
                        venue: event.venue ?? "",
                        joinLink: event.joinLink ?? "",
                        limitedSeats: !!event.totalSeats,
                        totalSeats: event.totalSeats ? String(event.totalSeats) : "",
                        startAt: formatDateTimeLocal(event.startAt),
                        endAt: formatDateTimeLocal(event.endAt),
                        contactInfo: event.contactInfo ?? "",
                        folder: "XYZ",
                        thumbnail: null,
                        media: [],
                        attachments: event.attachments ?? [],
                    }}
                    onSubmit={async (values) => {
                        
                        await eventService.update(event.id, values);
                        if (onEventUpdated) {
                            onEventUpdated();
                        }
                        setOpenEditModal(false);
                    }}
                    submitLabel="Update Event"
                    onCancel={() => setOpenEditModal(false)}
                />
            </Modal>

            {/* Confirmation delete event Modal */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Confirm Delete"
                footer={
                    <>
                        <Button
                            variant="warning"
                            onClick={() => setOpenDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleDelete}
                        >
                            Confirm
                        </Button>
                    </>
                }
            >
                <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete the event{" "}
                    <span className="font-semibold">{event?.title}</span>?
                </p>
            </Modal>

            <ThankYouModal
                isOpen={openThankYouModal}
                onClose={() => setOpenThankYouModal(false)}
                message={`Your request to join ${event.title} has been sent.`}
            />
        </>
    );
}
