"use client";

import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div
            className={`rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition ${className}`}
        >
            {children}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}
