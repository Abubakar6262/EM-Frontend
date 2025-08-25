"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { authService } from "@/services/auth";
import { ForgotPasswordSchema } from "@/validations/authSchema";



// ✅ Payload type
type ForgotPasswordPayload = {
    email: string;
};

export default function ForgotPasswordPage() {
    const [message, setMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const initialValues: ForgotPasswordPayload = { email: "" };

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
                        Forgot Password
                    </h1>

                    {message && <p className="text-green-500 text-center mb-4">{message}</p>}
                    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={ForgotPasswordSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setErrorMessage("");
                            setMessage("");
                            try {
                                // Assuming backend endpoint exists: POST /auth/forgot-password
                                const { email } = values;
                                await authService.forgotPassword({ email });
                                setMessage("If your email is registered, you will receive a reset link.");
                            } catch (err: unknown) {
                                setErrorMessage("Something went wrong. Please try again.");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="grid gap-6">
                                {/* Email */}
                                <div>
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="email"
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
                                    Send Reset Link
                                </Button>

                                {/* Back to login */}
                                <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                                    Remembered your password?{" "}
                                    <Link
                                        href="/login"
                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                    >
                                        Login
                                    </Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </motion.div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 dark:bg-indigo-800 text-white items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Reset Your Password</h2>
                    <p className="text-lg">
                        Enter your email and we’ll send you a secure link to reset your password.
                    </p>
                </div>
            </div>
        </div>
    );
}
