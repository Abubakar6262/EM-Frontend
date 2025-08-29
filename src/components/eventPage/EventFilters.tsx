"use client";

import { useEffect, useState } from "react";

interface EventFiltersProps {
    search: string;
    typeFilter: string;
    statusFilter: string;
    onSearchChange: (val: string) => void;
    onTypeChange: (val: string) => void;
    onStatusChange: (val: string) => void;
}

export default function EventFilters({
    search,
    typeFilter,
    statusFilter,
    onSearchChange,
    onTypeChange,
    onStatusChange,
}: EventFiltersProps) {
    const [isDashboard, setIsDashboard] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsDashboard(window.location.pathname.startsWith("/dashboard"));
        }
    }, []);

    return (
        <div
            className={`grid gap-4 w-full ${isDashboard
                    ? "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
        >
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full p-3 rounded-lg border dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition-colors duration-200"
            />

            {/* Type Filter */}
            <select
                className="w-full p-3 rounded-lg border dark:border-gray-700 
                     bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     transition-colors duration-200"
                value={typeFilter}
                onChange={(e) => onTypeChange(e.target.value)}
            >
                <option value="">All Types</option>
                <option value="ONSITE">Onsite</option>
                <option value="ONLINE">Online</option>
            </select>

            {/* Status Filter */}
            <select
                className="w-full p-3 rounded-lg border dark:border-gray-700 
                     bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     transition-colors duration-200"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option value="">All Status</option>
                <option value="incoming">Incoming</option>
                <option value="past">Past</option>
                <option value="live">Live</option>
            </select>
        </div>
    );
}
