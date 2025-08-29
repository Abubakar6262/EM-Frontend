"use client";
import { cn } from "../../lib/utils";
import React from "react";


type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};


export default function Input({ className, label, error, ...props }: Props) {
    return (
        <label className="block space-y-1">
            {label && <span className="text-sm text-foreground/80">{label}</span>}
            <input
                className={cn(
                    "w-full rounded-2xl border border-border bg-card px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40",
                    error && "ring-2 ring-red-500/50",
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </label>
    );
}