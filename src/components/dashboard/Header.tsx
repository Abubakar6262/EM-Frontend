"use client";

import { Menu } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/store";
import { getInitial } from "@/lib/utils";

type HeaderProps = {
    onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
    // 👇 get user from redux (adjust selector based on your store shape)
    const user = useSelector((state: RootState) => state.auth.user);


    return (
        <header className="sticky top-0 z-30 flex items-center justify-between bg-card border-b border-border px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <button className="md:hidden" onClick={onMenuClick}>
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>

                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    <span className="hidden md:inline-block">
                        <ThemeToggle />
                    </span>

                    {/* User avatar */}
                    {user?.profilePic ? (
                        <Image
                            src={user.profilePic}
                            alt={user.fullName || "User"}
                            width={36}
                            height={36}
                            className="rounded-full object-cover border border-border"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-foreground font-semibold">
                            {getInitial(user?.fullName ?? "")}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
