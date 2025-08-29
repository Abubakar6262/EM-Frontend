"use client";

import { RootState } from "@/store";
import { CalendarDays, Clock, Layers } from "lucide-react";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const events = useSelector((state: RootState) => state.events.myEvents);

  console.log(events);
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Events */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Layers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Events</p>
            <p className="text-xl font-semibold">{events ? events.length : 0}</p>
          </div>
        </div>

        {/* Past Events */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-xl">
            <Clock className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Past Events</p>
            <p className="text-xl font-semibold">12</p>
          </div>
        </div>

        {/* Incoming Events */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <CalendarDays className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Upcoming Events</p>
            <p className="text-xl font-semibold">13</p>
          </div>
        </div>
      </div>
    </div>
  );
}
