"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";
import { participantService, ParticipantEvent, PaginatedParticipantResponse } from "@/services/participant";
import Loader from "@/components/Loader";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button"; 
import Modal from "@/components/ui/Modal";  
import { notify } from "@/data/global";
import { handleApiError } from "@/lib/utils";

export default function MyJoinRequests() {
    const [requests, setRequests] = useState<ParticipantEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // For modal
    const [selectedRequest, setSelectedRequest] = useState<ParticipantEvent | null>(null);

    // Optional: if you get userId from auth context
    const userId = "CURRENT_USER_ID"; // 🔹 replace with your actual logged-in userId
    const limit = 5; // items per page

    const fetchRequests = async (page: number) => {
        try {
            setLoading(true);

            // Fetch paginated API response
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

    // Confirm cancel handler
    const handleConfirmCancel = async () => {
        if (!selectedRequest) return;

        try {
            // 🔹 Call delete request API
            await participantService.deleteMyRequest(selectedRequest.id);

            notify(`Your request to join "${selectedRequest.event.title}" has been canceled.`, "success");

            setSelectedRequest(null);

            // 🔄 refresh list after deletion
            fetchRequests(currentPage);
        } catch (error) {
            handleApiError(error, "Failed to cancel request");
        }
    };

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

                {requests.length === 0 ? (
                    <div className="p-4 rounded-xl bg-muted text-gray-500 dark:text-gray-400">
                        You have not sent any join requests yet.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((r) => (
                            <motion.div
                                key={r.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-card shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                            >
                                <h4 className="text-xl font-semibold mb-2">{r.event.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                                    {r.event.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} />{" "}
                                        {new Date(r.event.startAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock size={16} />{" "}
                                        {new Date(r.event.startAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
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

                                {/* Cancel button if status is pending */}
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
                        ))}
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

            {/* Cancel Request Confirmation Modal */}
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
