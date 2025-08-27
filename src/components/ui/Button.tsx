"use client";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import React, { ComponentProps } from "react";

type MotionButtonProps = ComponentProps<typeof motion.button>;

type Props = Omit<MotionButtonProps, "children"> & {
    variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "warning"
    | "outlinePrimary"
    | "outlineSecondary"
    | "outlineDanger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children?: React.ReactNode;
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

        danger: "bg-danger text-danger-foreground hover:opacity-90",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",

        outlinePrimary:
            "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        outlineSecondary:
            "border border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground",
        outlineDanger:
            "border border-danger text-danger hover:bg-danger hover:text-danger-foreground",
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
