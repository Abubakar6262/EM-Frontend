import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">

            <ProtectedRoute allowedRoles={["PARTICIPANT"]}>

                <Navbar />
                <main className="flex-1 container py-6">{children}</main>
                <Footer />
            </ProtectedRoute>
        </div>
    );
}