"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@/components/ui/Button";
import { UserProfileValues } from "@/services/auth";



interface UserProfileFormProps {
    initialValues: UserProfileValues;
    onSubmit: (values: UserProfileValues) => Promise<void> | void;
    submitLabel?: string;
}

const UserProfileSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
});

export default function UserProfileForm({
    initialValues,
    onSubmit,
    submitLabel = "Save",
}: UserProfileFormProps) {

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={UserProfileSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <Field
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage
                            name="fullName"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage
                            name="email"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <Field
                            as="select"
                            name="role"
                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="PARTICIPANT">Participant</option>
                            <option value="ORGANIZER">Organizer</option>
                        </Field>
                        <ErrorMessage
                            name="role"
                            component="p"
                            className="text-red-500 text-sm mt-1"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={isSubmitting}
                        className="w-full"
                    >
                        {submitLabel}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
