"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ResetPasswordSchema } from "@/validations/authSchema";
import { authService } from "@/services/auth";

type ResetPasswordPayload = {
    newPassword: string;
    confirmPassword: string;
};

export default function ResetPasswordForm() {
    const [message, setMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";

    useEffect(() => {
        if (!token) {
            setErrorMessage("Invalid or missing token.");
        }
    }, [token]);

    const initialValues: ResetPasswordPayload = {
        newPassword: "",
        confirmPassword: "",
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8"
                >
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
                        Reset Password
                    </h1>

                    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={ResetPasswordSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setErrorMessage("");
                            setMessage("");
                            try {
                                if (!token) throw new Error("Token is missing");

                                const data = await authService.resetPassword(token, values.newPassword);
                                if (!data.success) {
                                    setErrorMessage(data.message || "Something went wrong");
                                    setSubmitting(false);
                                    return;
                                }

                                values.newPassword = "";
                                values.confirmPassword = "";

                                setMessage("Password updated successfully! Redirecting to login...");
                                setTimeout(() => router.push("/login"), 3000);
                            } catch (err) {
                                console.error(err);
                                setErrorMessage("Something went wrong. Please try again.");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="grid gap-6">
                                {/* New Password */}
                                <div>
                                    <Field
                                        type="password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="newPassword"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
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
                                    Update Password
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </motion.div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 dark:bg-indigo-800 text-white items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Secure Your Account</h2>
                    <p className="text-lg">Enter your new password to reset your account securely.</p>
                </div>
            </div>
        </div>
    );
}
