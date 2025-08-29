"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type AttachmentType = "image" | "video";

export interface Attachment {
    id: string;
    url: string;
    type: AttachmentType;
}

interface AttachmentGalleryProps {
    attachments: Attachment[];
}

export default function AttachmentGallery({ attachments }: AttachmentGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openAttachment = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const nextAttachment = () => {
        setCurrentIndex((prev) => (prev + 1) % attachments.length);
    };

    const prevAttachment = () => {
        setCurrentIndex((prev) => (prev - 1 + attachments.length) % attachments.length);
    };

    if (!attachments || attachments.length === 0) return null;

    return (
        <div className="space-y-4">
            {/* Attachment grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {attachments.map((att, index) => (
                    <div
                        key={att.id}
                        className="cursor-pointer overflow-hidden rounded-lg relative"
                        onClick={() => openAttachment(index)}
                    >
                        {att.type === "image" ? (
                            <Image
                                src={att.url}
                                alt="Attachment"
                                width={200}
                                height={200}
                                className="w-full h-40 object-cover hover:scale-105 transition"
                            />
                        ) : (
                            <video
                                src={att.url}
                                className="w-full h-40 object-cover hover:scale-105 transition"
                                muted
                                loop
                            />
                        )}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white px-2 py-0.5 text-xs rounded">
                            {att.type.toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-90">
                    <div className="relative max-w-4xl w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-4">
                        <div className="flex justify-end mb-2">
                            <X
                                
                                className="w-6 h-6 text-red-600 dark:text-red-600 cursor-pointer hover:text-red-900 dark:hover:text-red-900"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                        {/* Attachment display */}
                        <div className="relative">
                            {attachments[currentIndex].type === "image" ? (
                                <Image
                                    src={attachments[currentIndex].url}
                                    alt="Attachment"
                                    width={1200}
                                    height={800}
                                    className="w-full h-[500px] object-contain"
                                />
                            ) : (
                                <video
                                    src={attachments[currentIndex].url}
                                    controls
                                    className="w-full h-[500px] object-contain"
                                />
                            )}

                            {/* Navigation */}
                            <button
                                onClick={prevAttachment}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
                            >
                                <ChevronLeft />
                            </button>
                            <button
                                onClick={nextAttachment}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
                            >
                                <ChevronRight />
                            </button>
                        </div>

                        {/* Custom Cancel Button below */}

                    </div>
                </div>
            )}
        </div>
    );
}
