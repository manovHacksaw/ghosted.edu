"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does the career guidance AI work?",
    answer:
      "Our AI analyzes your skills, interests, and goals to provide personalized career recommendations. It uses data from millions of job postings and career paths to identify opportunities that match your profile.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
  },
  {
    question: "Is there a student discount available?",
    answer:
      "Yes! Students with a valid .edu email address can get 50% off the Pro plan. Contact our support team to verify your student status.",
  },
  {
    question: "How does the internship placement guarantee work?",
    answer:
      "For Enterprise users, we guarantee at least one internship offer within 3 months of using our platform. If you don't receive an offer, we'll extend your subscription for free until you do.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at your next billing cycle.",
  },
]

export function PricingFAQ() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </motion.div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 text-left bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="font-medium text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-black/30 text-gray-300">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

