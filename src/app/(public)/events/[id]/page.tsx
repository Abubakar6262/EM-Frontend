"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Phone, Mail } from "lucide-react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Event, eventService } from "@/services/event";
import { fetchStart, fetchSuccess, fetchFailure } from "@/store/slices/eventSlice";
import Loader from "@/components/Loader";
import AttachmentGallery, { AttachmentType } from "@/components/AttachmentGallery";

// custom Modal
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { notify } from "@/data/global";
import { participantService } from "@/services/participant";

export default function EventDetailsPage() {
    const { id } = useParams();
    const eventId = Array.isArray(id) ? id[0] : id;
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    // Track participant status
    const [participantStatus, setParticipantStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE");

    const [showAllAttachments, setShowAllAttachments] = useState(false);

    // modal state
    const [openModal, setOpenModal] = useState(false);

    // Fetch event
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                dispatch(fetchStart());
                if (eventId) {
                    const response = await eventService.getById(eventId);
                    dispatch(fetchSuccess(response));
                    setEvent(response);

                    // find participant by current user
                    const participant = response.participants?.find((p) => p.userId === user?.id);

                    if (participant?.status === "PENDING") {
                        setParticipantStatus("PENDING");
                    } else if (participant) {
                        setParticipantStatus("APPROVED");
                    } else {
                        setParticipantStatus("NONE");
                    }
                }
            } catch (err: unknown) {
                console.error(err);
                dispatch(fetchFailure((err as Error).message || "Failed to load event"));
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId, dispatch, user?.id]);

    if (loading) return <Loader />;
    if (!event) return <p className="text-center py-20">Event not found</p>;

    const attachmentsToShow = showAllAttachments
        ? event.attachments
        : event.attachments?.slice(0, 3);

    // handle confirm join
    const handleJoinEvent = async () => {
        try {
            if (!eventId) return;

            // Call API
            await participantService.join(eventId);

            // Refresh event
            const updatedEvent = await eventService.getById(eventId);
            setEvent(updatedEvent);

            const participant = updatedEvent.participants?.find((p) => p.userId === user?.id);
            if (participant?.status === "PENDING") {
                setParticipantStatus("PENDING");
            } else if (participant) {
                setParticipantStatus("APPROVED");
            }

            setOpenModal(false);
            notify("Request has been sent", "success");
        } catch (error: unknown) {
            console.error(error);
            notify("Failed to join the event", "error");
        }
    };

    // Button label and disabled logic
    let joinLabel = "Join Event";
    let disabled = false;

    if (participantStatus === "PENDING") {
        joinLabel = "Request Pending";
        disabled = true;
    } else if (participantStatus === "APPROVED") {
        joinLabel = "Joined";
        disabled = true;
    }

    return (
        <div className={`min-h-screen p-4 md:p-6 space-y-8 ${user?.role !== "ORGANIZER" ? "max-w-7xl" : "w-full"} mx-auto`}>
            {/* Header */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                {event.thumbnail && (
                    <Image
                        src={event.thumbnail}
                        alt={event.title}
                        width={1200}
                        height={500}
                        className="w-full h-64 md:h-[400px] object-cover"
                    />
                )}
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                        {event.type.toUpperCase()}
                    </span>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                        {new Date(event.startAt) > new Date() ? "UPCOMING" : "PAST"}
                    </span>
                </div>
                {user?.role !== "ORGANIZER" && (<button
                    disabled={disabled}
                    onClick={() => user ? setOpenModal(true) : window.location.href = '/login'}
                    className={`absolute top-4 right-4 px-5 py-2 rounded-xl shadow text-white font-semibold transition
                        ${disabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {joinLabel}
                </button>)}
            </div>

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
                        <Button variant="secondary" onClick={handleJoinEvent}>Confirm</Button>
                    </>
                }
            >
                <p>
                    Are you sure you want to join{" "}
                    <span className="font-semibold">{event.title}</span>?
                </p>
            </Modal>

            {/* Main Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold">{event.title}</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {event.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {new Date(event.startAt).toLocaleString()} -{" "}
                                {new Date(event.endAt).toLocaleString()}
                            </div>
                            {event.venue && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> {event.venue}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organizers */}
                    {event.organizers?.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                            <h2 className="text-xl font-semibold">Organizers</h2>
                            <div className="space-y-3">
                                {event.organizers.map((org) => (
                                    <div
                                        key={org.id}
                                        className="p-4 border rounded-lg dark:border-gray-700"
                                    >
                                        <p className="font-medium">{org.fullName}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Mail className="w-4 h-4" /> {org.email}
                                        </div>
                                        {event.contactInfo && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <Phone className="w-4 h-4" /> {event.contactInfo}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Hosts */}
                    {event.hosts?.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                            <h2 className="text-xl font-semibold">Hosts</h2>
                            <div className="space-y-3">
                                {event.hosts.map((host,key) => (
                                    <div
                                        key={key}
                                        className="flex items-center gap-3 p-4 border rounded-lg dark:border-gray-700"
                                    >
                                        {/* Avatar with first letter */}
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold">
                                            {host.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{host.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{host.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attachments */}
                    {event.attachments?.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                            <h2 className="text-xl font-semibold">Attachments</h2>
                            <AttachmentGallery
                                attachments={attachmentsToShow.map((a) => ({
                                    ...a,
                                    type: a.type as AttachmentType,
                                }))}
                            />
                            {event.attachments.length > 3 && (
                                <button
                                    onClick={() => setShowAllAttachments((prev) => !prev)}
                                    className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2"
                                >
                                    {showAllAttachments
                                        ? "Show less"
                                        : `+${event.attachments.length - 3} more`}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Participants */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow space-y-4">
                        <h2 className="text-xl font-semibold">Participants</h2>
                        {event.participants?.length > 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                {event?.participants?.length} participant
                                {event?.participants?.length !== 1 && "s"} joined
                            </p>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                No participants yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}