"use client"

import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Basic career exploration for students just starting out",
    features: [
      "Career interest assessment",
      "Basic skill gap analysis",
      "Limited job recommendations",
      "Community forum access",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
    delay: 0.3,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "Advanced tools for serious career seekers",
    features: [
      "Everything in Free",
      "Personalized career roadmap",
      "Unlimited skill assessments",
      "AI resume feedback",
      "Mock interview preparation",
      "Priority email support",
    ],
    cta: "Start Pro Trial",
    popular: true,
    delay: 0.4,
  },
  {
    name: "Enterprise",
    price: "$29.99",
    period: "per month",
    description: "Complete solution for career advancement",
    features: [
      "Everything in Pro",
      "1-on-1 career coaching",
      "Employer connections",
      "Guaranteed internship placement",
      "Personalized learning paths",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    popular: false,
    delay: 0.5,
  },
]

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
      {tiers.map((tier) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: tier.delay }}
          className={`relative rounded-xl backdrop-blur-sm border ${
            tier.popular ? "border-[#00EDBE] bg-[#141BEB]/10" : "border-white/10 bg-white/5"
          } p-8 flex flex-col`}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <div className="bg-[#00EDBE] text-black font-medium py-1 px-4 rounded-full text-sm flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Most Popular
              </div>
            </div>
          )}

          <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">{tier.price}</span>
            {tier.period && <span className="text-gray-400 ml-2">{tier.period}</span>}
          </div>
          <p className="text-gray-400 mb-6">{tier.description}</p>

          <ul className="space-y-3 mb-8 flex-grow">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <Check className="w-5 h-5 text-[#00EDBE] mr-2 shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={
              tier.popular
                ? "bg-[#141BEB] hover:bg-[#141BEB]/80 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }
            size="lg"
          >
            {tier.cta}
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

