"use client";
import { cn } from "../../lib/utils";
import React from "react";


type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
};


export default function Textarea({ className, label, error, ...props }: Props) {
    return (
        <label className="block space-y-1">
            {label && <span className="text-sm text-foreground/80">{label}</span>}
            <textarea
                className={cn(
                    "w-full rounded-2xl border border-border bg-card px-3 py-2 outline-none focus:ring-2 focus:ring-primary/40",
                    error && "ring-2 ring-red-500/50",
                    className
                )}
                rows={5}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </label>
    );
}