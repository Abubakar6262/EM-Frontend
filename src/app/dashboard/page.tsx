"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { AdminDashboardData, eventService } from "@/services/event";
import { handleApiError } from "@/lib/utils";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

// Register Chart.js modules
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await eventService.getAdminDashboard();
        setDashboardData(res);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { font: { size: 12 } },
      },
      title: { display: false },
    },
  };

  const onlineVsOnsiteData = {
    labels: ["Online", "Onsite"],
    datasets: [
      {
        data: [
          dashboardData?.onlineVsOnsite.ONLINE,
          dashboardData?.onlineVsOnsite.ONSITE,
        ],
        backgroundColor: ["#3029a6", "#1b7048"],
      },
    ],
  };

  const eventsLast30DaysData = {
    labels: Object.keys(dashboardData?.eventsLast30Days ?? {}),
    datasets: [
      {
        label: "Events Created",
        data: Object.values(dashboardData?.eventsLast30Days ?? {}),
        backgroundColor: "#3029a6",
        borderRadius: 6,
      },
    ],
  };

  const stats = [
    { label: "Total Events", value: dashboardData?.totalEvents, move: "/dashboard/my-events" },
    { label: "Incoming Events", value: dashboardData?.incomingEvents, move: "/dashboard/my-events?status=incoming" },
    { label: "Past Events", value: dashboardData?.pastEvents, move: "/dashboard/my-events?status=past" },
    { label: "Ongoing Events", value: dashboardData?.ongoingEvents, move: "/dashboard/my-events?status=live" },
    { label: "Cancelled Events", value: dashboardData?.cancelledEvents, move: "/dashboard/my-events?status=cancelled" },
    { label: "Total Participants", value: dashboardData?.totalParticipants, move: "/dashboard/manage-requests" },
    {
      label: "Average Seats Filled",
      value: `${((dashboardData?.averageSeatsFilled ?? 0) * 100).toFixed(0)}%`,
      move: "/dashboard/my-events",
    },
    {
      label: "Pending Join Requests",
      value: dashboardData?.pendingJoinRequests,
      move: "/dashboard/manage-requests",
    },
    {
      label: "Approval Rate",
      value: `${((dashboardData?.approvalRate ?? 0) * 100).toFixed(0)}%`,
      move: "/dashboard/manage-requests",
    },
    {
      label: "Most Popular Event",
      value: dashboardData?.mostPopularEvent
        ? `${dashboardData.mostPopularEvent.title} (${dashboardData.mostPopularEvent.participantsCount} participants)`
        : "N/A",
      move: dashboardData?.mostPopularEvent
        ? `/dashboard/my-events/${dashboardData.mostPopularEvent.id}`
        : "/dashboard/my-events",
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl font-bold"
      >
        Organizer Dashboard
      </motion.h1>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push(stat.move)}
            className="bg-card rounded-2xl p-4 sm:p-5 shadow border border-border cursor-pointer hover:shadow-md transition"
          >
            <h3 className="text-base sm:text-lg font-medium">{stat.label}</h3>
            <p className="text-xl sm:text-2xl font-bold text-primary mt-2 break-words">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Online vs Onsite Pie */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow border border-border"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Online vs Onsite Events
          </h3>
          <div className="h-64 sm:h-72 md:h-96">
            <Pie
              data={onlineVsOnsiteData}
              options={{
                ...chartOptions,
                onClick: (_, elements) => {
                  if (!elements.length) return;
                  const index = elements[0].index;
                  const type = index === 0 ? "ONLINE" : "ONSITE";
                  router.push(`/dashboard/my-events?type=${type}`);
                },
              }}
            />
          </div>
        </motion.div>

        {/* Events Last 30 Days Bar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-4 sm:p-6 shadow border border-border"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Events Created (Last 30 Days)
          </h3>
          <div className="h-64 sm:h-72 md:h-96">
            <Bar data={eventsLast30DaysData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
