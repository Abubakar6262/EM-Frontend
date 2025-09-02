"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { SignupSchema } from "@/validations/authSchema";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store";
import { authService } from "@/services/auth";
import Link from "next/link";
import type { SignupPayload } from "@/services/auth";
import { handleApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { notify } from "@/data/global";

export default function SignupPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const initialValues: SignupPayload & { confirmPassword: string } = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "PARTICIPANT",
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
                        Create an account
                    </h1>

                    {errorMessage && (
                        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignupSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            setErrorMessage("");
                            try {
                                const { confirmPassword, ...signupData } = values;
                                const data = await authService.signup(signupData);
                                dispatch(setUser(data.user));
                                router.push("/login");
                                notify("Signup successful! Please log in.", "success");
                            } catch (error) {
                                handleApiError(error);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting, values, setFieldValue }) => (
                            <Form className="grid gap-6">
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

                                {/* Password */}
                                <div className="relative">
                                    <div className="relative flex items-center">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Password"
                                            className="w-full p-3 pr-10 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <div className="relative flex items-center">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            className="w-full p-3 pr-10 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* Role */}
                                <div className="flex gap-4 text-gray-900 dark:text-gray-100">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Field
                                            type="radio"
                                            name="role"
                                            value="PARTICIPANT"
                                            checked={values.role === "PARTICIPANT"}
                                            onChange={() => setFieldValue("role", "PARTICIPANT")}
                                        />
                                        Participant
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Field
                                            type="radio"
                                            name="role"
                                            value="ORGANIZER"
                                            checked={values.role === "ORGANIZER"}
                                            onChange={() => setFieldValue("role", "ORGANIZER")}
                                        />
                                        Organizer
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    loading={isSubmitting}
                                    className="w-full"
                                >
                                    Sign Up
                                </Button>

                                <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                                    Already have an account?{" "}
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
                    <h2 className="text-3xl font-bold">Secure Your Account</h2>
                    <p className="text-lg">
                        We ensure your personal information is safe and secure. Sign up and
                        get started today!
                    </p>
                </div>
            </div>
        </div>
    );
}
