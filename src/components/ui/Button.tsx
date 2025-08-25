"use client";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
};

export default function Button({
    className,
    children,
    variant = "primary",
    size = "md",
    loading,
    ...props
}: Props) {
    const base =
        "inline-flex items-center justify-center rounded-2xl font-medium shadow-soft disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none transition";

    const variants = {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        ghost: "bg-transparent border border-border hover:bg-muted",
    } as const;

    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    } as const;

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -1 }}
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        >
            {loading && (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            )}
            {children}
        </motion.button>
    );
}