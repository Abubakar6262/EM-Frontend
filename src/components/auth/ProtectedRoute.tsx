// "use client";

// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import Loader from "@/components/Loader";

// type ProtectedRouteProps = {
//     children: React.ReactNode;
//     allowedRoles: ("ADMIN" | "ORGANIZER" | "PARTICIPANT")[];
// };

// export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
//     const router = useRouter();
//     const { user, loading } = useSelector((state: RootState) => state.auth);

//     useEffect(() => {
//         if (!loading) {
//             // console.log(user)
//             if (!user) {
//                 router.replace("/");
//                 return;
//             }

//             if (!allowedRoles.includes(user.role)) {
//                 // role not allowed → kick out
//                 router.replace("/");
//                 return;
//             }
//         }
//     }, [user, loading, router, allowedRoles]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <Loader />
//             </div>
//         );
//     }

//     return <>{children}</>;
// }

// "use client";

// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Loader from "@/components/Loader";

// export default function ProtectedRoute({
//     children,
//     allowedRoles,
// }: {
//     children: React.ReactNode;
//     allowedRoles?: string[];
// }) {
//     const { user, loading } = useSelector((state: RootState) => state.auth);
//     const router = useRouter();
//     const [checked, setChecked] = useState(false);

//     useEffect(() => {
//         if (!loading) {
//             if (!user) {
//                 router.replace("/"); // not logged in
//             } else if (allowedRoles && !allowedRoles.includes(user.role)) {
//                 router.replace("/"); // wrong role
//             } else {
//                 setChecked(true); //  user is allowed
//             }
//         }
//     }, [user, loading, allowedRoles, router]);

//     //  Show loader while checking OR redirecting
//     if (loading || !checked) return <Loader />;

//     return <>{children}</>;
// }
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles?: string[];
}) {
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (!loading) {
            if (!user) {
                router.replace("/"); // not logged in
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                router.replace("/"); // wrong role
            } else {
                setChecked(true); // user is allowed
            }
        }
    }, [user, loading, allowedRoles, router]);

    //  Prevent hydration mismatch: render nothing until client mounts
    if (!mounted) return null;

    // Show loader while checking OR redirecting
    if (loading || !checked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
