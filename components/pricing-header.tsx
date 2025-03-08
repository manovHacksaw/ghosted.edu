"use client"

import { motion } from "framer-motion"

export function PricingHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6"
      >
        Choose Your
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141BEB] to-[#00EDBE]"> Career Path</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-400 text-xl"
      >
        Select the plan that best fits your career goals and budget. All plans include access to our AI-powered career
        guidance.
      </motion.p>
    </div>
  )
}

