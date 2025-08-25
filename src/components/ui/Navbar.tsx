"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
// import { logout } from "@/store/slices/authSlice";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        // dispatch(logout());
        // optional: redirect to home
        // router.push("/");
    };

    const isAuthenticated = Boolean(user);

    return (
        <nav className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        EventHub
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link
                            href="/"
                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
                        >
                            Contact
                        </Link>

                        {/* Theme toggle for desktop */}
                        <ThemeToggle />

                        {!isAuthenticated ? (
                            <div className="flex space-x-3">
                                <Link href="/signup">
                                    <Button variant="primary">Sign Up</Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="secondary">Login</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen((p) => !p)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        {user?.profilePic ? (
                                            <Image
                                                src={user.profilePic}
                                                alt="profile"
                                                width={36}
                                                height={36}
                                                className="w-9 h-9 rounded-full border object-cover"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full border flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                                        >
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <User className="w-4 h-4 mr-2" /> Profile
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <Settings className="w-4 h-4 mr-2" /> Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        <button onClick={() => setMobileOpen((p) => !p)}>
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="md:hidden bg-white dark:bg-gray-900 px-4 py-2 space-y-2 shadow"
                    >
                        <Link href="/" className="block text-gray-700 dark:text-gray-200">
                            Home
                        </Link>
                        <Link href="/about" className="block text-gray-700 dark:text-gray-200">
                            About
                        </Link>
                        <Link href="/contact" className="block text-gray-700 dark:text-gray-200">
                            Contact
                        </Link>

                        <ThemeToggle />

                        {!isAuthenticated ? (
                            <div className="space-y-2">
                                <Link href="/signup">
                                    <Button variant="primary" className="w-full">
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="secondary" className="w-full">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href="/profile"
                                    className="block text-gray-700 dark:text-gray-200"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block text-gray-700 dark:text-gray-200"
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-gray-700 dark:text-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
