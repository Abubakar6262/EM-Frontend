"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { authService } from "@/services/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store";
import Link from "next/link";
import { LoginSchema } from "@/validations/authSchema";

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [errorMessage, setErrorMessage] = useState("");

    const initialValues = { email: "", password: "" };

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
                        Login
                    </h1>

                    {errorMessage && (
                        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setErrorMessage("");
                            try {
                                const data = await authService.login(values);
                                console.log("Login response:", data);

                                if (!data.success) {
                                    setErrorMessage(data.message || "Login failed");
                                    setSubmitting(false); // important to stop the button loader
                                    return;
                                }

                                dispatch(setUser(data.user));
                                window.location.href = "/";
                            } catch (err: any) {
                                // fallback for real HTTP errors
                                const msg =
                                    err.response?.data?.message || err.message || "Login failed";
                                setErrorMessage(msg);
                            } finally {
                                setSubmitting(false); // always stop Formik loading
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
                                        placeholder="Email"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                    {/* Forgot Password Link */}
                                    <div className="text-right mt-2">
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    loading={isSubmitting}
                                    className="w-full"
                                >
                                    Login
                                </Button>

                                {/* Signup Link */}
                                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Don’t have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </motion.div>
            </div>

            {/* Right Side Background */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 dark:bg-indigo-800 text-white items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold">Welcome Back</h2>
                    <p className="text-lg">
                        Log in to manage your events and participate easily.
                    </p>
                </div>
            </div>
        </div>
    );
}
