"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { motion } from "framer-motion"
import { Briefcase, MapPin, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SparklesCore } from "@/components/sparkles"

interface Job {
  title: string
  company: string
  location: string
  apply_url: string
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get("/api/jobs")

        if (Array.isArray(response.data)) {
          setJobs(response.data[2] || [])
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setError("Failed to load jobs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative pt-20">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesjobs"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00EDBE"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Web3{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#141BEB] to-[#00EDBE]">Jobs</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover the latest opportunities in the Web3 space and take your career to the next level.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-[#00EDBE]" />
            </motion.div>
            <p className="mt-4 text-gray-400 text-lg">Loading opportunities...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-lg p-6 text-center"
          >
            <p className="text-red-400 text-lg">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#141BEB] hover:bg-[#141BEB]/80 text-white"
            >
              Try Again
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-[#141BEB]/20 rounded-lg p-6 hover:border-[#00EDBE]/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-[#141BEB]/20 rounded-lg">
                    <Briefcase className="h-6 w-6 text-[#00EDBE]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00EDBE] transition-colors">
                  {job.title}
                </h3>
                <p className="text-gray-400 mb-1">{job.company}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <Link
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#00EDBE] hover:text-white transition-colors"
                >
                  Apply Now
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

