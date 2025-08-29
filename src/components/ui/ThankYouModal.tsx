"use client";

import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ThankYouModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string; // optional custom message
    title?: string; // optional custom title
}

export default function ThankYouModal({
    isOpen,
    onClose,
    title = "Thank You!",
    message = "Your request has been submitted successfully.",
}: ThankYouModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            size="sm"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex flex-col items-center justify-center text-center p-6"
            >
                {/* Animated checkmark circle */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-800 mb-4"
                >
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-10 h-10 text-green-600 dark:text-green-300"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </motion.svg>
                </motion.div>

                {/* Title */}
                <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-bold text-gray-800 dark:text-gray-100"
                >
                    {title}
                </motion.h3>

                {/* Message */}
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 dark:text-gray-300 mt-2"
                >
                    {message}
                </motion.p>

                {/* Close button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6"
                >
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </motion.div>
            </motion.div>
        </Modal>
    );
}
