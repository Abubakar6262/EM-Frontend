"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-20 text-center text-white">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        About EventFlow
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-lg opacity-90"
      >
        Empowering organizers and participants with a seamless event management
        experience.
      </motion.p>
    </section>
  );
}
