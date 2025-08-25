"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/assets/images/Logo.png";
import { socials } from "@/data/socialIcons";
import { footerNavigation } from "@/data/footernavigation";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-2">
                        <Image
                            src={Logo}
                            alt="EventHub"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <h2 className="text-xl font-bold">EventHub</h2>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xs">
                        Join EventHub to explore, manage, and attend events effortlessly. We
                        connect people through experiences.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-3 mt-5">
                        {socials.map((social, i) => (
                            <motion.a
                                key={i}
                                whileHover={{ scale: 1.1 }}
                                href={social.href}
                                aria-label={social.name}
                                className="w-9 h-9 rounded-full flex items-center justify-center 
                     bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 
                     hover:bg-indigo-600 hover:text-white transition"
                            >
                                <social.icon className="w-5 h-5" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                        {footerNavigation.map((link, i) => (
                            <li key={i}>
                                <Link
                                    href={link.href}
                                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-lg font-semibold mb-4">Call Us At</h3>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm mb-3">
                        <Phone className="w-5 h-5 text-indigo-600" />
                        <span>+01 234 567 89</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        <span>support@eventhub.com</span>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6">
                <p>© {new Date().getFullYear()} EventHub. All Rights Reserved.</p>
                <div className="flex gap-5 mt-2 md:mt-0">
                    <Link href="#" className="hover:text-indigo-600 transition">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="hover:text-indigo-600 transition">
                        Terms of Use
                    </Link>
                </div>
            </div>
        </footer>
    );
}
