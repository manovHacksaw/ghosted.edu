"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ghost, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export const ProcessingResults = ({ formData }: { formData: any }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState(0)
  const [processingComplete, setProcessingComplete] = useState(false)

  useEffect(() => {
    const processingStages = [
      "Analyzing your profile data...",
      "Evaluating your skills and experience...",
      "Identifying career opportunities...",
      "Generating personalized recommendations...",
      "Finalizing your career assessment...",
    ]

    // Simulate processing stages for better UX
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => {
        if (prev < processingStages.length - 1) {
          return prev + 1
        }
        clearInterval(stageInterval)
        return prev
      })
    }, 3000)

    async function getInsights() {
      try {
        setLoading(true)

        const response = await fetch("/api/career-assessment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: formData }),
        })

        if (!response.ok) {
          throw new Error("Failed to process career data")
        }

        const data = await response.json()
        console.log("Career assessment data:", data)

        // Store the form data and response in localStorage
        localStorage.setItem("careerFormData", JSON.stringify(formData))
        localStorage.setItem("careerAssessmentData", JSON.stringify(data))

        // Extract summary from the response
        if (data.response) {
          try {
            // Try to parse the JSON response if it's a string
            const parsedResponse =
              typeof data.response === "string"
                ? JSON.parse(data.response.match(/\{[\s\S]*\}/)?.[0] || "{}")
                : data.response

            setSummary(parsedResponse.summary || "Your career assessment has been completed successfully.")
          } catch (parseError) {
            console.error("Error parsing response:", parseError)
            setSummary("Your career assessment has been completed successfully.")
          }
        }

        setProcessingComplete(true)
        clearInterval(stageInterval)
        setLoading(false)

        // Navigate to dashboard with form data
        const encodedFormData = encodeURIComponent(JSON.stringify(formData))
        router.push(`/dashboard?formData=${encodedFormData}`)
      } catch (error) {
        console.error("Error generating career data:", error)
        setError("There was an error processing your data. Please try again.")
        clearInterval(stageInterval)
        setLoading(false)
      }
    }

    getInsights()

    return () => clearInterval(stageInterval)
  }, [formData, router])

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Error Processing Results
          </CardTitle>
          <CardDescription className="text-red-600/80 dark:text-red-400/80">
            We encountered a problem while analyzing your career data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (loading && !processingComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ghost className="h-5 w-5 text-primary" />
            Analyzing Your Career Data
          </CardTitle>
          <CardDescription>
            Our AI is processing your information to provide personalized career insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{Math.min(processingStage * 20 + 10, 95)}%</span>
            </div>
            <Progress value={Math.min(processingStage * 20 + 10, 95)} className="h-2" />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm font-medium">
                {
                  [
                    "Analyzing your profile data...",
                    "Evaluating your skills and experience...",
                    "Identifying career opportunities...",
                    "Generating personalized recommendations...",
                    "Finalizing your career assessment...",
                  ][processingStage]
                }
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground italic">
            This may take a minute or two. We're using advanced AI to provide you with the most accurate career
            guidance.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Assessment Complete
        </CardTitle>
        <CardDescription>Your career assessment has been processed successfully</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-primary/5 p-6 border border-primary/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Ghost className="h-5 w-5 text-primary" />
            Career Summary
          </h3>
          <p className="text-muted-foreground">
            {summary ||
              "Your career assessment has been completed. View your full dashboard to see detailed insights and recommendations."}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => router.push("/dashboard")} size="lg">
          View Full Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}