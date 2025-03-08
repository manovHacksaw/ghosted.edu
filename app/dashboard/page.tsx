"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Award,
  TrendingUp,
  LineChart,
  Zap,
  Target,
  GraduationCap,
  Lightbulb,
  BriefcaseBusiness,
  BookOpen,
  MapPin,
  Clock,
  Download,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
  Plus,
  User,
  Bell,
  Settings,
  ExternalLink,
  Ghost,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SparklesCore } from "@/components/sparkles"
import { FloatingPaper } from "@/components/floating-paper"

// Define types for better type safety
interface CareerRecommendation {
  title: string
  matchPercentage: number
  description: string
  tags: string[]
  salaryRange?: string
  growthPotential?: string
  marketDemand?: string
  applicationLink?: string
}

interface SkillAnalysis {
  name: string
  level: number
  category?: string
  importance?: string
}

interface StrengthsWeaknesses {
  strengths: string[]
  weaknesses: string[]
  marketCompetitiveness?: string
  improvementAreas?: string[]
}

interface NextStep {
  title: string
  description: string
  icon: "education" | "skills" | "network" | "learning" | "experience" | "location"
  timeline?: string
  priority?: "high" | "medium" | "low"
  resources?: string[]
}

interface CareerInsights {
  topCareers: CareerRecommendation[]
  skillsAnalysis: SkillAnalysis[]
  strengthsWeaknesses: StrengthsWeaknesses
  nextSteps: NextStep[]
  matchScore: number
  marketInsights?: {
    trends: string[]
    opportunities: string[]
    challenges: string[]
  }
}

export default function DashboardPage({ initialFormData }: DashboardPageProps) {
  const [insights, setInsights] = useState<CareerInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    const fetchInsightsFromStorage = () => {
      try {
        // Try to get assessment data from localStorage
        const savedAssessmentData = localStorage.getItem("careerAssessmentData")
        const savedFormData = localStorage.getItem("careerFormData")
        
        // Use initialFormData if available, otherwise use localStorage data
        const currentFormData = initialFormData || (savedFormData ? JSON.parse(savedFormData) : null)
        setFormData(currentFormData)

        if (savedAssessmentData) {
          const parsedData = JSON.parse(savedAssessmentData)
          
          // Parse the response if it's a string
          let insightData
          if (typeof parsedData.response === "string") {
            const jsonMatch = parsedData.response.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              insightData = JSON.parse(jsonMatch[0])
            }
          } else {
            insightData = parsedData.response
          }
          

          if (insightData) {
            setInsights({
              ...insightData,
              // Merge with form data for additional context
              formData: currentFormData,
            })
            setError(null)
          } else {
            throw new Error("Invalid insights data structure")
          }
        } else {
          // For demo purposes, if no data exists, create sample data
          const sampleData = generateSampleData()
          localStorage.setItem("careerInsights", JSON.stringify(sampleData))
          setInsights(sampleData)
        }
      } catch (error) {
        console.error("Error retrieving insights:", error)
        setError("Failed to load career insights. Please try completing the assessment again.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsightsFromStorage()
  }, [initialFormData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/[0.96] bg-grid-white/[0.02]">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full border-4 border-[#141BEB]/20 border-t-[#00EDBE] animate-spin mx-auto"></div>
          <p className="mt-4 text-white">Loading your career insights...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black/[0.96] bg-grid-white/[0.02] p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-[#00EDBE]" />
          <h1 className="mb-4 text-3xl font-bold text-white">Career Insights Not Available</h1>
          <p className="mb-8 text-gray-400">{error}</p>
          <Link href="/">
            <Button className="bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">Go to Assessment</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black/[0.96] bg-grid-white/[0.02] p-4">
        <div className="text-center max-w-md">
          <h1 className="mb-4 text-3xl font-bold text-white">No Career Insights Found</h1>
          <p className="mb-8 text-gray-400">
            Complete your profile and assessment to get personalized career recommendations.
          </p>
          <Link href="/">
            <Button className="bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">Go to Profile Setup</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/[0.96] bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#00EDBE"
        />
      </div>

      {/* Floating papers in background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={8} />
      </div>

      {/* Header/Navigation */}
      

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10 pt-20">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Your Career Dashboard</h1>
          <p className="mt-2 text-gray-400">
            AI-powered analysis of your career assessment and personalized recommendations.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Match Score */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Career Match Score</CardTitle>
              <CardDescription className="text-gray-400">
                Overall compatibility with recommended careers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative mb-4 flex h-36 w-36 items-center justify-center rounded-full">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2a2d3d" strokeWidth="10" />
                    {/* Progress arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 45 * (insights.matchScore / 100)} ${
                        2 * Math.PI * 45 * (1 - insights.matchScore / 100)
                      }`}
                      strokeDashoffset={2 * Math.PI * 45 * 0.25}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#141BEB" />
                        <stop offset="100%" stopColor="#00EDBE" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{insights.matchScore}%</span>
                    <span className="text-xs text-gray-400">Match Score</span>
                  </div>
                </div>
                <div className="mt-2 text-center text-sm text-gray-400">
                  {insights.matchScore >= 80
                    ? "Excellent match with recommended career paths"
                    : insights.matchScore >= 60
                      ? "Good potential with some areas for improvement"
                      : "Consider exploring alternative career paths"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full text-[#00EDBE] border-white/10 hover:bg-white/5">
                View Score Details <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Top Career Recommendations */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Top Career Recommendations</CardTitle>
                <CardDescription className="text-gray-400">
                  Based on your skills, interests, and assessment
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="hidden sm:flex h-8 text-xs text-[#00EDBE] border-white/10 hover:bg-white/5"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.topCareers.map((career, index) => (
                  <div key={index} className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{career.title}</h3>
                      <Badge className="bg-[#141BEB] text-white">{career.matchPercentage}% Match</Badge>
                    </div>
                    <p className="mb-3 text-sm text-gray-400">{career.description}</p>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {career.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="border-white/10 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        {career.salaryRange && (
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-[#00EDBE]" />
                            <span>{career.salaryRange}</span>
                          </div>
                        )}
                        {career.growthPotential && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-[#00EDBE]" />
                            <span>{career.growthPotential}</span>
                          </div>
                        )}
                        {career.marketDemand && (
                          <div className="flex items-center gap-1">
                            <LineChart className="h-4 w-4 text-[#00EDBE]" />
                            <span>{career.marketDemand}</span>
                          </div>
                        )}
                      </div>
                      {career.applicationLink && (
                        <Button
                          variant="outline"
                          className="text-[#00EDBE] border-white/10 hover:bg-white/5"
                          asChild
                        >
                          <Link href={career.applicationLink} target="_blank">
                            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="block sm:hidden">
              <Button variant="link" className="text-[#00EDBE] hover:text-[#00EDBE]/80 px-0">
                View all career matches <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Skills Analysis */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Skills Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Your current skill levels and areas for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.skillsAnalysis.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{skill.name}</span>
                        {skill.category && (
                          <Badge variant="outline" className="border-white/10 text-gray-300">
                            {skill.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{skill.level}%</span>
                        {skill.importance && (
                          <Badge
                            variant="outline"
                            className={`border-white/10 ${
                              skill.importance === "High"
                                ? "text-[#00EDBE]"
                                : skill.importance === "Medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                            }`}
                          >
                            {skill.importance} Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={skill.level} className="h-2 bg-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-[#141BEB] to-[#00EDBE] rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </Progress>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-[#00EDBE] border-white/10 hover:bg-white/5">
                Develop Skills <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Strengths & Weaknesses */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Strengths & Areas for Growth</CardTitle>
              <CardDescription className="text-gray-400">Based on your assessment responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="strengths">
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger
                    value="strengths"
                    className="data-[state=active]:bg-[#141BEB] data-[state=active]:text-white"
                  >
                    Strengths
                  </TabsTrigger>
                  <TabsTrigger
                    value="weaknesses"
                    className="data-[state=active]:bg-[#141BEB] data-[state=active]:text-white"
                  >
                    Growth Areas
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="strengths" className="mt-4 space-y-3">
                  {insights.strengthsWeaknesses.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Zap className="mt-0.5 h-4 w-4 text-[#00EDBE]" />
                      <span className="text-sm text-gray-300">{strength}</span>
                    </div>
                  ))}
                  {insights.strengthsWeaknesses.marketCompetitiveness && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <LineChart className="h-4 w-4 text-[#00EDBE]" />
                        <span>Market Competitiveness: {insights.strengthsWeaknesses.marketCompetitiveness}</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="weaknesses" className="mt-4 space-y-3">
                  {insights.strengthsWeaknesses.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Target className="mt-0.5 h-4 w-4 text-[#141BEB]" />
                      <span className="text-sm text-gray-300">{weakness}</span>
                    </div>
                  ))}
                  {insights.strengthsWeaknesses.improvementAreas && (
                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-3">
                      <h4 className="mb-2 text-sm font-medium text-white">Key Improvement Areas:</h4>
                      <ul className="space-y-2">
                        {insights.strengthsWeaknesses.improvementAreas.map((area, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                            <AlertCircle className="h-4 w-4 text-[#00EDBE]" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Recommended Next Steps</CardTitle>
                <CardDescription className="text-gray-400">
                  Actionable steps to progress toward your career goals
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="hidden sm:flex h-8 text-xs text-[#00EDBE] border-white/10 hover:bg-white/5"
              >
                Create Plan <Plus className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {insights.nextSteps.map((step, index) => (
                  <div key={index} className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141BEB]/20">
                        {step.icon === "education" && <GraduationCap className="h-5 w-5 text-[#00EDBE]" />}
                        {step.icon === "skills" && <Lightbulb className="h-5 w-5 text-[#00EDBE]" />}
                        {step.icon === "network" && <BriefcaseBusiness className="h-5 w-5 text-[#00EDBE]" />}
                        {step.icon === "learning" && <BookOpen className="h-5 w-5 text-[#00EDBE]" />}
                        {step.icon === "experience" && <LineChart className="h-5 w-5 text-[#00EDBE]" />}
                        {step.icon === "location" && <MapPin className="h-5 w-5 text-[#00EDBE]" />}
                      </div>
                      {step.priority && (
                        <Badge
                          variant="outline"
                          className={`border-white/10 ${
                            step.priority === "high"
                              ? "text-[#00EDBE]"
                              : step.priority === "medium"
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }`}
                        >
                          {step.priority.charAt(0).toUpperCase() + step.priority.slice(1)} Priority
                        </Badge>
                      )}
                    </div>
                    <h3 className="mb-2 text-base font-medium text-white">{step.title}</h3>
                    <p className="mb-3 text-sm text-gray-400">{step.description}</p>
                    {step.timeline && (
                      <div className="mb-3 flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="h-4 w-4 text-[#00EDBE]" />
                        <span>{step.timeline}</span>
                      </div>
                    )}
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-sm font-medium text-white">Resources:</h4>
                        <ul className="space-y-1">
                          {step.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="flex items-center gap-2 text-sm text-gray-400">
                              <Download className="h-3 w-3 text-[#00EDBE]" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      className="mt-3 h-8 px-0 text-[#00EDBE] hover:text-[#00EDBE]/80 hover:bg-transparent"
                    >
                      Learn more <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          {insights.marketInsights && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm md:col-span-3">
              <CardHeader>
                <CardTitle className="text-white">Market Insights</CardTitle>
                <CardDescription className="text-gray-400">Industry trends and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
                      <TrendingUp className="h-5 w-5 text-[#00EDBE]" />
                      Current Trends
                    </h3>
                    <ul className="space-y-2">
                      {insights.marketInsights.trends.map((trend, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
                      <Lightbulb className="h-5 w-5 text-[#00EDBE]" />
                      Opportunities
                    </h3>
                    <ul className="space-y-2">
                      {insights.marketInsights.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-white">
                      <AlertCircle className="h-5 w-5 text-[#141BEB]" />
                      Challenges
                    </h3>
                    <ul className="space-y-2">
                      {insights.marketInsights.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

function generateSampleData(): CareerInsights {
  return {
    matchScore: 85,
    topCareers: [
      {
        title: "Blockchain Developer",
        matchPercentage: 90,
        description: "Develop decentralized applications and smart contracts on blockchain networks.",
        tags: ["Solidity", "Ethereum", "Rust", "Smart Contracts"],
        salaryRange: "$100K - $180K",
        growthPotential: "High Growth",
        marketDemand: "Very High",
        applicationLink: "https://web3.career/r/=EjN3cTO__nqgcSC"
      },
      {
        title: "Web3  Engineer",
        matchPercentage: 83,
        description: "Build decentralized application (dApp) interfaces that interact with smart contracts.",
        tags: ["React", "Ethers.js", "Web3.js", "TailwindCSS"],
        salaryRange: "$90K - $150K",
        growthPotential: "High",
        marketDemand: "Strong Demand",
        applicationLink: "https://web3.career/r/=cDO2cTO__nqgcSC"
      },
    ],
    skillsAnalysis: [
      {
        name: "Solidity",
        level: 80,
        category: "Technical",
        importance: "High",
      },
      {
        name: "Cryptography",
        level: 70,
        category: "Security",
        importance: "High",
      },
      {
        name: "Smart Contract Development",
        level: 85,
        category: "Blockchain",
        importance: "High",
      },
      {
        name: "React.js",
        level: 75,
        category: "Frontend",
        importance: "Medium",
      },
      {
        name: "Rust",
        level: 60,
        category: "Backend",
        importance: "Medium",
      },
    ],
    strengthsWeaknesses: {
      strengths: [
        "Understanding of blockchain fundamentals",
        "Smart contract development",
        "Decentralized application architecture",
        "Security best practices",
      ],
      weaknesses: [
        "Scalability optimization knowledge",
        "Advanced cryptographic algorithms",
        "Cross-chain interoperability",
        "Backend microservices in Web3",
      ],
      marketCompetitiveness: "High",
      improvementAreas: [
        "Learn zero-knowledge proofs and Layer 2 solutions",
        "Contribute to open-source Web3 projects",
        "Gain experience with cross-chain development",
      ],
    },
    nextSteps: [
      {
        title: "Master Solidity Development",
        description: "Deepen your expertise in smart contract development using Solidity.",
        icon: "learning",
        timeline: "3-6 months",
        priority: "high",
        resources: ["Ethereum Docs", "CryptoZombies", "Solidity by Example"],
      },
      {
        title: "Contribute to Web3 Open Source Projects",
        description: "Work on blockchain-based projects to gain practical experience.",
        icon: "experience",
        timeline: "Ongoing",
        priority: "high",
        resources: ["Gitcoin Bounties", "Ethereum Foundation Grants"],
      },
      {
        title: "Explore Zero-Knowledge Proofs",
        description: "Learn about zk-SNARKs and zk-STARKs to develop scalable privacy-focused applications.",
        icon: "learning",
        timeline: "3-6 months",
        priority: "medium",
        resources: ["ZKProof.org", "Polygon zkEVM Documentation"],
      },
      {
        title: "Stay Updated with Web3 Trends",
        description: "Follow industry news and updates to stay ahead in blockchain technology.",
        icon: "skills",
        timeline: "Ongoing",
        priority: "medium",
        resources: ["Bankless Newsletter", "Messari Research"],
      },
    ],
    marketInsights: {
      trends: [
        "Rapid adoption of Layer 2 scaling solutions",
        "Institutional interest in DeFi and NFTs",
        "Growth of decentralized identity solutions",
        "Expansion of DAOs for governance",
      ],
      opportunities: [
        "High-paying smart contract auditing roles",
        "Demand for Web3 UX/UI designers",
        "Cross-chain bridge development",
        "Growth of play-to-earn gaming",
      ],
      challenges: [
        "Scalability and gas fee optimization",
        "Regulatory uncertainty in different countries",
        "Security vulnerabilities in smart contracts",
        "User experience barriers in dApp adoption",
      ],
    },
  };
}