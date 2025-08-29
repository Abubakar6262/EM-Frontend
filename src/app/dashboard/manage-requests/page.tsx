"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Mail, User } from "lucide-react";
import {
    participantService,
    PaginatedParticipantResponse,
    ParticipantEvent,
} from "@/services/participant";
import Loader from "@/components/Loader";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { notify } from "@/data/global";
import { handleApiError } from "@/lib/utils";

type ActionType = "APPROVED" | "REJECTED" | null;

export default function OrganizerJoinRequests() {
    const [requests, setRequests] = useState<ParticipantEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedRequest, setSelectedRequest] = useState<ParticipantEvent | null>(null);
    const [actionType, setActionType] = useState<ActionType>(null);

    const limit = 5;

    const fetchRequests = async (page: number) => {
        try {
            setLoading(true);

            const response: PaginatedParticipantResponse =
                await participantService.getOrganizerRequests(page, limit);

            setRequests(response.participants || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch organizer requests:", error);
            setRequests([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(currentPage);
    }, [currentPage]);

    const handleConfirmAction = async () => {
        if (!selectedRequest || !actionType) return;

        try {
            await participantService.updateRequestStatus(selectedRequest.id, actionType);

            notify(
                `You have ${actionType === "APPROVED" ? "approved" : "rejected"
                } ${selectedRequest.user.fullName}'s request for "${selectedRequest.event.title}".`,
                "success"
            );

            setSelectedRequest(null);
            setActionType(null);

            fetchRequests(currentPage);
        } catch (error) {
            handleApiError(error, "Failed to update request");
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
                <h3 className="text-lg font-semibold mb-4">Join Requests for Your Events</h3>

                {requests.length === 0 ? (
                    <div className="p-4 rounded-xl bg-muted text-gray-500 dark:text-gray-400">
                        No join requests yet.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {requests.map((r) => (
                            <motion.div
                                key={r.id}
                                whileHover={{ scale: 1.01 }}
                                className="bg-card shadow-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                            >
                                {/* Participant Info */}
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4 className="text-lg font-semibold flex items-center gap-2">
                                            <User size={16} /> {r.user.fullName}
                                        </h4>
                                        <p className="text-sm flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Mail size={14} /> {r.user.email}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-medium ${r.status === "APPROVED"
                                                ? "bg-green-100 text-green-600"
                                                : r.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {r.status}
                                    </span>
                                </div>

                                {/* Event Info */}
                                <div className="bg-muted p-3 rounded-xl mb-3 text-sm">
                                    <p className="font-medium">{r.event.title}</p>
                                    <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />{" "}
                                            {new Date(r.event.startAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />{" "}
                                            {new Date(r.event.startAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {r.status === "PENDING" && (
                                    <div className="flex gap-3">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedRequest(r);
                                                setActionType("APPROVED");
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedRequest(r);
                                                setActionType("REJECTED");
                                            }}
                                        >
                                            Reject
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

            {/* Confirmation Modal */}
            <Modal
                isOpen={!!selectedRequest}
                onClose={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                }}
                title={`${actionType === "APPROVED" ? "Approve" : "Reject"} Join Request`}
                footer={
                    <>
                        <Button
                            variant="warning"
                            onClick={() => {
                                setSelectedRequest(null);
                                setActionType(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={actionType === "APPROVED" ? "secondary" : "primary"}
                            onClick={handleConfirmAction}
                        >
                            Confirm {actionType === "APPROVED" ? "Approve" : "Reject"}
                        </Button>
                    </>
                }
            >
                {selectedRequest && (
                    <p>
                        Are you sure you want to{" "}
                        <span className="font-semibold">
                            {actionType === "APPROVED" ? "approve" : "reject"}
                        </span>{" "}
                        <span className="font-semibold">{selectedRequest.user.fullName}</span>’s
                        request for{" "}
                        <span className="font-semibold">{selectedRequest.event.title}</span>?
                    </p>
                )}
            </Modal>
        </>
    );
}
