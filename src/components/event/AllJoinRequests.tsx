"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Link as LinkIcon, MapPin, CheckCircle, Clock as PendingIcon, List } from "lucide-react";
import { participantService, ParticipantEvent, PaginatedParticipantResponse } from "@/services/participant";
import Loader from "@/components/Loader";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { notify } from "@/data/global";
import { handleApiError } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function MyJoinRequests() {
    const [requests, setRequests] = useState<ParticipantEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedRequest, setSelectedRequest] = useState<ParticipantEvent | null>(null);
    const [filter, setFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL"); // <-- Add filter state

    const user = useSelector((state: RootState) => state.auth.user);

    const userId = "CURRENT_USER_ID";
    const limit = 5;

    const fetchRequests = async (page: number) => {
        try {
            setLoading(true);
            const response: PaginatedParticipantResponse =
                await participantService.getAllJoinRequests(userId, page, limit);

            setRequests(response.participants || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch join requests:", error);
            setRequests([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(currentPage);
    }, [currentPage]);

    const handleConfirmCancel = async () => {
        if (!selectedRequest) return;

        try {
            await participantService.deleteMyRequest(selectedRequest.id);
            notify(`Your request to join "${selectedRequest.event.title}" has been canceled.`, "success");
            setSelectedRequest(null);
            fetchRequests(currentPage);
        } catch (error) {
            handleApiError(error, "Failed to cancel request");
        }
    };

    // Compute counts
    const totalRequests = requests.length;
    const approvedRequests = requests.filter(r => r.status === "APPROVED").length;
    const pendingRequests = requests.filter(r => r.status === "PENDING").length;

    // Apply filter
    const filteredRequests =
        filter === "ALL"
            ? requests
            : requests.filter(r => r.status === filter);

    if (loading) return <Loader />;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <h3 className="text-lg font-semibold mb-4">My Join Requests</h3>

                {/* Summary Cards with onClick */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div
                        onClick={() => setFilter("ALL")}
                        className={`cursor-pointer bg-card shadow-md rounded-xl p-4 flex items-center gap-4 border  "border-gray-200 dark:border-gray-800"`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <List size={28} className="text-blue-600 font-bold" />
                        </div>
                        <div>
                            <p className="text-xl text-gray-500 dark:text-gray-400 font-bold">Total Requests</p>
                            <p className="text-xl font-bold">{totalRequests}</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setFilter("APPROVED")}
                        className={`cursor-pointer bg-card shadow-md rounded-xl p-4 flex items-center gap-4 border "border-gray-200 dark:border-gray-800"`}
                    >
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle size={28} className="text-green-600 font-bold" />
                        </div>
                        <div>
                            <p className="text-xl text-gray-500 dark:text-gray-400 font-bold">Approved</p>
                            <p className="text-xl font-bold">{approvedRequests}</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setFilter("PENDING")}
                        className={`cursor-pointer bg-card shadow-md rounded-xl p-4 flex items-center gap-4 border border-gray-200 dark:border-gray-800"`}
                    >
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                            <PendingIcon size={28} className="text-yellow-600 font-bold" />
                        </div>
                        <div>
                            <p className="text-xl text-gray-500 dark:text-gray-400 font-bold">Pending</p>
                            <p className="text-xl font-bold">{pendingRequests}</p>
                        </div>
                    </div>
                </div>

                {filteredRequests.length === 0 ? (
                    <div className="p-4 rounded-xl bg-muted text-gray-500 dark:text-gray-400">
                        No join requests to show.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredRequests.map((r) => {
                            const start = new Date(r.event.startAt);
                            const end = new Date(r.event.endAt);

                            return (
                                <motion.div
                                    key={r.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-card shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xl font-semibold mb-2">{r.event.title}</h4>
                                        <span
                                            className={`ml-1 px-2 py-1 rounded-lg text-xs font-medium ${r.event.type === "ONLINE"
                                                ? "bg-purple-100 text-purple-700"
                                                : r.event.type === "ONSITE"
                                                    ? "bg-teal-100 text-teal-700"
                                                    : "bg-gray-200 text-gray-800"
                                                }`}
                                        >
                                            {r.event.type}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                                        {r.event.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <span className="flex items-center gap-2">
                                            <Calendar size={16} />{" "}
                                            {start.toLocaleDateString()} - {end.toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} />{" "}
                                            {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                                            {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Users size={16} /> Status:
                                            <span
                                                className={`ml-1 px-2 py-1 rounded-lg text-xs font-medium ${r.status === "APPROVED"
                                                    ? "bg-green-100 text-green-600"
                                                    : r.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {r.status}
                                            </span>
                                        </span>
                                    </div>

                                    {/* Link only show to participant when status is approved */}
                                    {
                                        user && user.role === "PARTICIPANT" && r.status === "APPROVED" && (
                                            r.event.type === "ONLINE" && r.event.joinLink && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                                                    <LinkIcon size={16} />
                                                    <a href={r.event.joinLink} target="_blank" className="underline">
                                                        Join Event
                                                    </a>
                                                </div>
                                            )
                                        )
                                    }

                                    {r.event.type === "ONSITE" && r.event.venue && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400 mb-2">
                                            <MapPin size={16} />
                                            <span>{r.event.venue}</span>
                                        </div>
                                    )}

                                    {r.status === "PENDING" && (
                                        <div className="mt-4">
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                onClick={() => setSelectedRequest(r)}
                                            >
                                                Cancel Request
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </motion.div>

            <Modal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                title="Cancel Join Request"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedRequest(null)}>
                            Close
                        </Button>
                        <Button variant="warning" onClick={handleConfirmCancel}>
                            Confirm Cancel
                        </Button>
                    </>
                }
            >
                {selectedRequest && (
                    <p>
                        Are you sure you want to cancel your request for{" "}
                        <span className="font-semibold">{selectedRequest.event.title}</span>?
                    </p>
                )}
            </Modal>
        </>
    );
}
