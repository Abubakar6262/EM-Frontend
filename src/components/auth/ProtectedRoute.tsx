"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader";

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles: ("ADMIN" | "ORGANIZER" | "PARTICIPANT")[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!loading) {
            // console.log(user)
            if (!user) {
                router.replace("/");
                return;
            }

            if (!allowedRoles.includes(user.role)) {
                // role not allowed → kick out
                router.replace("/");
                return;
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
