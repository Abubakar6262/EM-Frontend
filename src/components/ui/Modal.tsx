"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    showCloseButton?: boolean;
    footer?: ReactNode; // optional footer (for confirm/cancel buttons)
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    footer,
    size = "md",
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className={`relative w-full ${sizeClasses[size]} mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex justify-between items-center border-b border-border px-4 py-3 shrink-0">
                        {title && (
                            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-4 overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-2 border-t border-border px-4 py-3 bg-muted/40 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
