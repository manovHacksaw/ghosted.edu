"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { UserCircle, Sparkles } from "lucide-react"
import { FloatingCards } from "@/components/floating-cards"
import { GhostAnimation } from "@/components/ghost-animation"
import { useOCAuth } from "@opencampus/ocid-connect-js"
import Link from "next/link"

export default function Hero() {
  const { authState, ocAuth} = useOCAuth();
  console.log(authState)
  return (
    <div className="relative min-h-[calc(100vh-76px)] pt-32 my-auto flex items-center">
      {/* Floating job cards background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingCards count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Never Get
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141BEB] to-[#00EDBE]">
                {" "}
                Ghosted
              </span>{" "}
              Again
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            AI-powered career guidance that helps students explore careers, identify skill gaps, and find personalized
            internships with verified employer feedback.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="rounded-xl bg-[#141BEB] hover:bg-[#141BEB]/80 text-white px-8">
              <UserCircle className="mr-2 h-5 w-5" />
              Create Profile
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl text-white border-[#00EDBE] hover:bg-[#00EDBE]/20">
              <Sparkles className="mr-2 h-5 w-5" />
              <Link href="/jobs">Explore Internships</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated ghost */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <GhostAnimation />
      </div>
    </div>
  )
}

