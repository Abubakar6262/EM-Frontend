"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <motion.div
            className="flex justify-center items-center space-x-2 my-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <button
                className="px-3 py-1 text-sm rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={cn(
                        "px-3 py-1 text-sm rounded-lg border transition",
                        currentPage === page
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                >
                    {page}
                </button>
            ))}

            <button
                className="px-3 py-1 text-sm rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </motion.div>
    );
}