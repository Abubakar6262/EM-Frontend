"use client";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Import schema + data
import { ContactSchema } from "@/validations/ContactSchema";
import { contactData } from "@/data/contactData";
import Loader from "@/components/Loader";

export default function ContactPage() {

    if (!contactData || contactData.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <Loader/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* Hero Section */}
            <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-20 text-center text-white">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Contact Us
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mx-auto text-lg opacity-90 px-2 sm:px-0"
                >
                    We’d love to hear from you! Whether you have a question, feedback, or partnership idea —
                    let’s connect.
                </motion.p>
            </section>

            {/* Contact Info */}
            <section className="max-w-6xl mx-auto px-0 sm:px-6 py-16 grid gap-8 md:grid-cols-3">
                {contactData.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg"
                    >
                        <item.icon className="w-10 h-10 text-indigo-600 mb-4" />
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">{item.value}</p>
                    </motion.div>
                ))}
            </section>

            {/* Contact Form */}
            <section className="max-w-4xl mx-auto px-0 sm:px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>

                    <Formik
                        initialValues={{ name: "", email: "", subject: "", message: "" }}
                        validationSchema={ContactSchema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            console.log("📩 Contact Form Submitted:", values);
                            setTimeout(() => {
                                resetForm();
                                setSubmitting(false);
                            }, 1000);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="grid gap-6">
                                {/* Name & Email */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Field
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div>
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <Field
                                        type="text"
                                        name="subject"
                                        placeholder="Subject"
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage name="subject" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Message */}
                                <div>
                                    <Field
                                        as="textarea"
                                        name="message"
                                        placeholder="Your Message..."
                                        rows={5}
                                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage name="message" component="p" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                                    type="submit"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </motion.button>
                            </Form>
                        )}
                    </Formik>
                </motion.div>
            </section>
        </div>
    );
}