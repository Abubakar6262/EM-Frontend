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

const mockData = {
  totalEvents: 6,
  incomingEvents: 4,
  pastEvents: 2,
  ongoingEvents: 0,
  cancelledEvents: 0,
  totalParticipants: 1,
  averageSeatsFilled: 0.07,
  mostPopularEvent: {
    id: "cmesifusp0007uc2ok1taf4wg",
    title: "Tech Innovators Summit 2025",
    participantsCount: 1,
  },
  pendingJoinRequests: 2,
  approvalRate: 1,
  onlineVsOnsite: { ONLINE: 1, ONSITE: 5 },
  eventsLast30Days: {
    "2025-08-28": 2,
    "2025-08-29": 2,
    "2025-08-26": 1,
    "2025-08-27": 1,
  },
};

export default function Dashboard() {
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
          mockData.onlineVsOnsite.ONLINE,
          mockData.onlineVsOnsite.ONSITE,
        ],
        backgroundColor: ["#3029a6", "#1b7048"],
      },
    ],
  };

  const eventsLast30DaysData = {
    labels: Object.keys(mockData.eventsLast30Days),
    datasets: [
      {
        label: "Events Created",
        data: Object.values(mockData.eventsLast30Days),
        backgroundColor: "#3029a6",
        borderRadius: 6,
      },
    ],
  };

  const stats = [
    { label: "Total Events", value: mockData.totalEvents },
    { label: "Incoming Events", value: mockData.incomingEvents },
    { label: "Past Events", value: mockData.pastEvents },
    { label: "Ongoing Events", value: mockData.ongoingEvents },
    { label: "Cancelled Events", value: mockData.cancelledEvents },
    { label: "Total Participants", value: mockData.totalParticipants },
    {
      label: "Average Seats Filled",
      value: `${(mockData.averageSeatsFilled * 100).toFixed(0)}%`,
    },
    {
      label: "Pending Join Requests",
      value: mockData.pendingJoinRequests,
    },
    {
      label: "Approval Rate",
      value: `${(mockData.approvalRate * 100).toFixed(0)}%`,
    },
    {
      label: "Most Popular Event",
      value: `${mockData.mostPopularEvent.title} (${mockData.mostPopularEvent.participantsCount} participants)`,
    },
  ];

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
            className="bg-card rounded-2xl p-4 sm:p-5 shadow border border-border"
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
            <Pie data={onlineVsOnsiteData} options={chartOptions} />
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
