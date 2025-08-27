"use client";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { EventSchema } from "@/validations/eventSchema";
import { eventService } from "@/services/event";
import { handleApiError } from "@/lib/utils";
import { notify } from "@/data/global";



interface Host {
    name: string;
    email: string;
}
export interface EventFormValues {
    title: string;
    description: string;
    hosts: Host[];
    type: "ONLINE" | "ONSITE";
    venue: string;
    joinLink: string;
    limitedSeats: boolean;
    totalSeats: number | string;
    startAt: string;
    endAt: string;
    contactInfo: string;
    folder: string;
    thumbnail: File | null;
    media: File[];
}

export default function CreateEventPage() {
    const [submittedData, setSubmittedData] = useState<EventFormValues | null>(null);

    const initialValues: EventFormValues = {
        title: "",
        description: "",
        hosts: [{ name: "", email: "" }],
        type: "ONSITE",
        venue: "",
        joinLink: "",
        limitedSeats: false,
        totalSeats: "",
        startAt: "",
        endAt: "",
        contactInfo: "",
        folder: "",
        thumbnail: null,
        media: [],
    };

    return (
        <div className="flex min-h-screen dark:bg-gray-900 w-full">
            <div className="w-full flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full  p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                >
                    <h1 className="text-3xl font-bold mb-6  text-gray-900 dark:text-gray-100">
                        Create Event
                    </h1>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={EventSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                const response = await eventService.create(values);
                                console.log("Event created:", response);
                                resetForm();
                                notify("Event created successfully", "success");
                            } catch (error) {
                                handleApiError(error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, values, setFieldValue, resetForm }) => (
                            <Form className="grid gap-6">
                                {/* Title */}
                                <div>
                                    <Field
                                        type="text"
                                        name="title"
                                        placeholder="Event Title"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage name="title" component="p" className="text-red-500 text-sm mt-1" />
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
                                    <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Hosts */}
                                <div>
                                    <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100">Hosts</label>
                                    <FieldArray name="hosts">
                                        {({ remove, push }) => (
                                            <div className="space-y-3">
                                                {values.hosts.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                                                    >
                                                        {/* Host Name */}
                                                        <div>
                                                            <Field
                                                                type="text"
                                                                name={`hosts[${index}].name`}
                                                                placeholder="Host Name"
                                                                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                            <ErrorMessage name={`hosts[${index}].name`} component="p" className="text-red-500 text-sm mt-1" />
                                                        </div>

                                                        {/* Host Email */}
                                                        <div>
                                                            <Field
                                                                type="email"
                                                                name={`hosts[${index}].email`}
                                                                placeholder="Host Email"
                                                                className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            />
                                                            <ErrorMessage name={`hosts[${index}].email`} component="p" className="text-red-500 text-sm mt-1" />
                                                        </div>

                                                        {/* Remove Button */}
                                                        <Button
                                                            type="button"
                                                            variant="warning"
                                                            size="md"
                                                            onClick={() => remove(index)}
                                                            className="w-full md:w-24"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button type="button" variant="secondary" onClick={() => push({ name: "", email: "" })}>
                                                    + Add Host
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>

                                {/* Type + Venue/JoinLink */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex gap-6 text-gray-900 dark:text-gray-100">
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
                                            <ErrorMessage name="joinLink" component="p" className="text-red-500 text-sm mt-1" />
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
                                            <ErrorMessage name="venue" component="p" className="text-red-500 text-sm mt-1" />
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
                                        <ErrorMessage name="startAt" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <Field
                                            type="datetime-local"
                                            name="endAt"
                                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <ErrorMessage name="endAt" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Limited Seats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <label className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
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
                                            <ErrorMessage name="totalSeats" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    )}
                                </div>

                                {/* Contact Info + Folder */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Field
                                            type="text"
                                            name="contactInfo"
                                            placeholder="Contact Info"
                                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <ErrorMessage name="contactInfo" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Thumbnail + Media */}
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Thumbnail */}
                                    <div>
                                        <label className="block text-gray-900 dark:text-gray-100 mb-2">
                                            Thumbnail
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFieldValue("thumbnail", e.target.files?.[0])}
                                                className="block w-full text-sm text-gray-900 dark:text-gray-100
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-gray-500 file:text-white
                       hover:file:bg-gray-400"
                                            />
                                            <ErrorMessage name="thumbnail" component="p" className="text-red-500 text-sm mt-1" />
                                        </div>
                                    </div>

                                    {/* Media */}
                                    <div>
                                        <label className="block text-gray-900 dark:text-gray-100 mb-2">
                                            Media (images/videos)
                                        </label>
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
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="warning"
                                        size="lg"
                                        onClick={() => {
                                            setSubmittedData(null);
                                            resetForm(); // ✅ clear form fields
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        size="lg"
                                        loading={isSubmitting}
                                    >
                                        Create Event
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    {/* Show submitted data */}
                    {submittedData && (
                        <pre className="mt-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-x-auto text-sm">
                            {JSON.stringify(submittedData, null, 2)}
                        </pre>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
