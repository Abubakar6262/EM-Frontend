"use client";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
        >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
};

export default ThemeToggle;
