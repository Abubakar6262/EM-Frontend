"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

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

    // Generate page numbers with ellipsis logic
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than or equal to maxVisiblePages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(1);

            // Calculate start and end of visible page range
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're at the beginning
            if (currentPage <= 3) {
                endPage = 4;
            }

            // Adjust if we're at the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push("ellipsis-left");
            }

            // Add page numbers in range
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push("ellipsis-right");
            }

            // Always include last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <motion.div
            className="flex justify-end items-center space-x-2 my-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Previous Button */}
            <button
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg border transition",
                    "bg-white dark:bg-gray-800 border-[#DDF3F7]",
                    "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4 text-[#45494A] dark:text-white" />
            </button>

            {/* Page Numbers */}
            {pages.map((page, index) => {
                if (page === "ellipsis-left" || page === "ellipsis-right") {
                    return (
                        <span
                            key={index}
                            className="flex items-center justify-center w-8 h-8 text-[#838586] dark:text-white"
                        >
                            <MoreHorizontal className="h-4 w-4 dark:text-white" />
                        </span>
                    );
                }

                return (
                    <button
                        key={index}
                        onClick={() => onPageChange(page as number)}
                        className={cn(
                            "flex items-center justify-center w-8 h-8 text-sm rounded-lg border transition",
                            currentPage === page
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white dark:bg-gray-800 dark:text-white border-[#DDF3F7] text-[#838586] hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        )}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg border transition",
                    "bg-white dark:bg-gray-800 border-[#DDF3F7]",
                    "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4 text-[#45494A] dark:text-white" />
            </button>
        </motion.div>
    );
}