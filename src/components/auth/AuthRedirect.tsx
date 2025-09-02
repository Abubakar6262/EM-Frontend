"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const roleRedirects: Record<string, string> = {
    PARTICIPANT: "/events",
    ORGANIZER: "/dashboard",
    ADMIN: "/admin",
};

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    // extra local state to avoid flashing children
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user) {
                const redirectPath = roleRedirects[user.role] || "/";
                router.replace(redirectPath);
            } else {
                setChecked(true); // safe to show children
            }
        }
    }, [user, loading, router]);

    if (loading || (!user && !checked)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    // if user is NOT logged in, show auth page
    return !user ? <>{children}</> : null;
}