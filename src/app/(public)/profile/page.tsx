"use client";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Button from "@/components/ui/Button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Pencil } from "lucide-react";
import { authService } from "@/services/auth";
import { setUser } from "@/store/slices/authSlice";
import { notify } from "@/data/global";
import { EditProfileSchema, PasswordSchema } from "@/validations/userSchema";
import { handleApiError } from "@/lib/utils";
import AllJoinRequests from "@/components/event/AllJoinRequests";

// --------------------
// Validation Schema
// --------------------






// --------------------
// Components
// --------------------
export default function ProfilePage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const dispatch = useDispatch();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        try {
            const response = await authService.updateProfilePic(e.target.files[0]);
            // Assuming API returns updated user
            dispatch(
                setUser(
                    user ? { ...user, profilePic: response.profilePic } : null
                )
            );

            notify("Profile picture updated successfully", "success");
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            notify("Failed to update profile picture", "error");
        }
    };


    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-muted/30">
            {/* Left Side - Profile Card */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:w-1/3 w-full bg-card shadow-md rounded-2xl p-6 flex flex-col items-center relative"
            >
                {/* Profile Image / Initial */}
                <div className="relative w-28 h-28">
                    {user?.profilePic ? (
                        <Image
                            src={user.profilePic}
                            alt="Profile"
                            fill
                            className="rounded-full border-4 border-primary shadow-md object-cover"
                        />
                    ) : (
                        <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-primary shadow-md bg-gray-200 text-gray-800 text-3xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}

                    {/* Small Edit Icon on Avatar */}
                    <input
                        onChange={handleFileChange}
                        accept="image/*"
                        type="file"
                        id="profilePicInput"
                        className="hidden"
                    />
                    <label
                        htmlFor="profilePicInput"
                        className="absolute bottom-2 right-2 bg-primary text-white p-1 rounded-full shadow hover:bg-primary/80 cursor-pointer"
                    >
                        <Pencil size={16} />
                    </label>
                </div>

                <h2 className="mt-4 text-xl font-semibold">{user?.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                </p>
                <span className="mt-2 px-3 py-1 rounded-full text-sm bg-primary text-primary-foreground">
                    {user?.role}
                </span>

                <Button
                    className="mt-4 w-full"
                    variant="outlinePrimary"
                    size="md"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Profile
                </Button>

                {/* Update Password Form */}
                <div className="w-full mt-6">
                    <h3 className="text-lg font-semibold mb-4">Update Password</h3>
                    <Formik
                        initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
                        validationSchema={PasswordSchema}
                        onSubmit={async (values, { resetForm, setSubmitting }) => {
                            try {
                                const response = await authService.updatePassword({
                                    oldPassword: values.oldPassword,
                                    newPassword: values.newPassword,
                                });

                                notify(response.message, "success");
                                resetForm();
                            } catch (error) {
                                handleApiError(error, "Failed to update password")
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="grid gap-4">
                                <div>
                                    <Field
                                        type="password"
                                        name="oldPassword"
                                        placeholder="Old Password"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="oldPassword"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <Field
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="newPassword"
                                        component="p"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                </div>
            </motion.div>

            {/* Right Side - Tabs and Forms */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:w-2/3 w-full bg-card shadow-md rounded-2xl p-6"
            >
                {/* My Join Requests */}
                <div className="mb-8">
                    <AllJoinRequests />
                </div>
            </motion.div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
                size="md"
            >
                <Formik
                    initialValues={{
                        fullName: user?.fullName || "",
                        phone: user?.phone || "",
                        email: user?.email || "",
                        role: user?.role || "",
                    }}
                    validationSchema={EditProfileSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await authService.updateUserInfo({
                                fullName: values.fullName,
                                phone: values.phone,
                            });

                            dispatch(setUser({ ...user, ...response.user }));
                            notify("Profile updated successfully", "success");
                            setIsEditModalOpen(false);
                        } catch (error) {
                            console.error("Failed to update profile:", error);
                            notify("Failed to update profile", "error");
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="grid gap-4">
                            {/* Editable Fields */}
                            <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <Field
                                    type="text"
                                    name="fullName"
                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Phone</label>
                                <Field
                                    type="text"
                                    name="phone"
                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Disabled Fields */}
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <Field
                                    type="text"
                                    name="email"
                                    disabled
                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Role</label>
                                <Field
                                    type="text"
                                    name="role"
                                    disabled
                                    className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-not-allowed"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                loading={isSubmitting}
                                className="w-full"
                            >
                                Save Changes
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}
