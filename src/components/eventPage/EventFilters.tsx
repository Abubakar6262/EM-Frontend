"use client";

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
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:flex-1 md:w-80 p-3 rounded-lg border dark:border-gray-700 
                   bg-gray-50 dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition-colors duration-200 md:max-w-[400px]"
            />

            {/* Filters Container */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Type Filter Dropdown */}
                <select
                    className="w-full sm:w-48 p-3 rounded-lg border dark:border-gray-700 
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

                {/* Status Filter Dropdown */}
                <select
                    className="w-full sm:w-48 p-3 rounded-lg border dark:border-gray-700 
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
        </div>
    );
}
