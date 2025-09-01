"use client";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Button from "@/components/ui/Button";
import { getEventSchema } from "@/validations/eventSchema";
import { handleApiError } from "@/lib/utils";
import { notify } from "@/data/global";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { EventFormValues } from "@/app/dashboard/create-event/page";
import Image from "next/image";
import { Attachment, eventService } from "@/services/event";
import { Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import { useRouter } from "next/navigation";

interface EventFormProps {
    initialValues: EventFormValues;
    onSubmit: (values: EventFormValues) => Promise<void>;
    submitLabel?: string;
    onCancel?: () => void;
}

export default function EventForm({
    initialValues,
    onSubmit,
    submitLabel = "Save",
    onCancel,
}: EventFormProps) {
    const [attachments, setAttachments] = useState<Attachment[]>(
        initialValues.attachments || []
    );
    const [openDeleteModal, setOpenDeleteModal] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        setAttachments(initialValues.attachments || []);
    }, [initialValues]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
            <Formik
                initialValues={{ ...initialValues, attachments: undefined }}
                validationSchema={getEventSchema(!!initialValues)}
                enableReinitialize
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        await onSubmit({ ...values, attachments });
                        notify(
                            submitLabel === "Create Event"
                                ? "Event created successfully"
                                : "Event updated successfully",
                            "success"
                        );
                        if (submitLabel === "Create Event") {
                            resetForm();
                            router.push("/dashboard/my-events");
                        }
                    } catch (error) {
                        handleApiError(error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, values, resetForm, setFieldValue }) => (
                    <Form className="grid gap-6">
                        {/* Title */}
                        <div>
                            <Field
                                type="text"
                                name="title"
                                placeholder="Event Title"
                                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage
                                name="title"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Field
                                as="textarea"
                                name="description"
                                placeholder="Event Description"
                                rows={4}
                                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage
                                name="description"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Hosts */}
                        <div>
                            <label className="block mb-2 font-medium">Hosts</label>
                            <FieldArray name="hosts">
                                {({ remove, push }) => (
                                    <div className="space-y-3">
                                        {values.hosts.map((_, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                                            >
                                                <Field
                                                    type="text"
                                                    name={`hosts[${index}].name`}
                                                    placeholder="Host Name"
                                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <Field
                                                    type="email"
                                                    name={`hosts[${index}].email`}
                                                    placeholder="Host Email"
                                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="warning"
                                                    size="md"
                                                    onClick={() => remove(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => push({ name: "", email: "" })}
                                        >
                                            + Add Host
                                        </Button>
                                    </div>
                                )}
                            </FieldArray>
                        </div>

                        {/* Type + Venue/JoinLink */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <Field type="radio" name="type" value="ONLINE" />
                                    Online
                                </label>
                                <label className="flex items-center gap-2">
                                    <Field type="radio" name="type" value="ONSITE" />
                                    Onsite
                                </label>
                            </div>
                            {values.type === "ONLINE" && (
                                <div>
                                    <Field
                                        type="url"
                                        name="joinLink"
                                        placeholder="Join Link"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="joinLink"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            )}
                            {values.type === "ONSITE" && (
                                <div>
                                    <Field
                                        type="text"
                                        name="venue"
                                        placeholder="Venue"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="venue"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Field
                                    type="datetime-local"
                                    name="startAt"
                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage
                                    name="startAt"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <Field
                                    type="datetime-local"
                                    name="endAt"
                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage
                                    name="endAt"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                        </div>

                        {/* Limited Seats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <label className="flex items-center gap-3">
                                <Field type="checkbox" name="limitedSeats" />
                                Limited Seats
                            </label>
                            {values.limitedSeats && (
                                <div>
                                    <Field
                                        type="number"
                                        name="totalSeats"
                                        placeholder="Total Seats"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="totalSeats"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <Field
                                type="text"
                                name="contactInfo"
                                placeholder="Contact Info"
                                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <ErrorMessage
                                name="contactInfo"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Thumbnail */}
                        <div>
                            <label className="block mb-2">Thumbnail</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFieldValue("thumbnail", e.target.files?.[0] || null)
                                }
                                className="block w-full text-sm text-gray-900 dark:text-gray-100
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-500 file:text-white
                hover:file:bg-gray-400"
                            />
                            <ErrorMessage
                                name="thumbnail"
                                component="p"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        {/* Display Attachments */}
                        {attachments.length > 0 && (
                            <div>
                                <label className="block mb-2 font-medium">Attachments</label>
                                <div className="flex flex-wrap gap-4">
                                    {attachments.map((att: Attachment, index: number) => {
                                        const isVideo = att.url.match(/\.(mp4|webm|ogg)$/i);

                                        return (
                                            <div
                                                key={index}
                                                className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border dark:border-gray-700"
                                            >
                                                {isVideo ? (
                                                    <video
                                                        src={att.url}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={att.url}
                                                        alt={`Attachment ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        width={200}
                                                        height={200}
                                                    />
                                                )}

                                                <button
                                                    type="button"
                                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow"
                                                    onClick={() => setOpenDeleteModal(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Media */}
                        <div>
                            <label className="block mb-2">Media (images/videos)</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={(e) =>
                                    setFieldValue(
                                        "media",
                                        e.target.files ? Array.from(e.target.files) : []
                                    )
                                }
                                className="block w-full text-sm text-gray-900 dark:text-gray-100
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-500 file:text-white
                hover:file:bg-gray-400"
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-4">
                            {onCancel && (
                                <Button
                                    type="button"
                                    variant="warning"
                                    size="lg"
                                    onClick={() => {
                                        resetForm();
                                        onCancel();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                size="lg"
                                loading={isSubmitting}
                            >
                                {submitLabel}
                            </Button>
                        </div>

                        {/* Delete Confirmation Modal */}
                        <Modal
                            isOpen={openDeleteModal !== null}
                            onClose={() => setOpenDeleteModal(null)}
                            title="Delete Attachment"
                            size="sm"
                            footer={
                                <>
                                    <Button
                                        type="button"
                                        variant="warning"
                                        onClick={() => setOpenDeleteModal(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        onClick={async () => {
                                            if (openDeleteModal !== null) {
                                                const toDelete = attachments[openDeleteModal];
                                                try {
                                                    await eventService.deleteAttachment(toDelete.id);
                                                    setAttachments((prev) =>
                                                        prev.filter((_, idx) => idx !== openDeleteModal)
                                                    );
                                                    notify("Deleted successfully", "success");
                                                } catch (error) {
                                                    handleApiError(error);
                                                } finally {
                                                    setOpenDeleteModal(null);
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </>
                            }
                        >
                            <p>Do you want to delete this attachment?</p>
                        </Modal>
                    </Form>
                )}
            </Formik>
        </motion.div>
    );
}
