"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Footer from "@/components/dashboard/Footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <ProtectedRoute allowedRoles={["ORGANIZER"]}>
            <div className="flex min-h-screen max-h-screen bg-bg text-fg">
                {/* Sidebar */}
                <Sidebar open={open} onClose={() => setOpen(false)} />

                {/* Main Area */}
                <div className="flex flex-1 flex-col">
                    {/* Fixed Header */}
                    <Header onMenuClick={() => setOpen(true)} />

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto px-6 py-6">
                        {children}
                    </main>

                    {/* Fixed Footer */}
                    <Footer />
                </div>
            </div>
        </ProtectedRoute>
    );
}
