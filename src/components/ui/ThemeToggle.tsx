"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
    fullWidth?: boolean; // optional prop
}

const ThemeToggle = ({ fullWidth = false }: ThemeToggleProps) => {
    const [dark, setDark] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setDark(true);
        }
    }, []);

    // Apply theme when changed
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className={`px-4 py-2 flex items-center gap-2 rounded 
        bg-gray-200 dark:bg-gray-700 dark:text-white 
        hover:scale-105 transition
        ${fullWidth ? "w-full justify-center rounded-2xl" : "w-auto justify-start"}`}
        >
            {dark ? (
                <>
                    <Sun className="w-4 h-4" color="#F59E0B" /> Light Mode
                </>
            ) : (
                <>
                    <Moon className="w-4 h-4" color="#F59E0B" /> Dark Mode
                </>
            )}
        </button>
    );
};

export default ThemeToggle;
