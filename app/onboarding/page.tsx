"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { ProfileForm } from "./_components/profile-form"
import { EducationForm } from "./_components/education-form"
import { SkillsForm } from "./_components/skills-form"
import { InterestsForm } from "./_components/interests-form"
import { ExperienceForm } from "./_components/expereince-form"
import { CareerAssessment } from "./_components/carrer-assessment"
import { ProcessingResults } from "./_components/processing-result"
import { useOCAuth } from "@opencampus/ocid-connect-js"


const steps = [
 
  { id: "education", title: "Education" },
  { id: "skills", title: "Skills" },
  { id: "interests", title: "Interests" },
  { id: "experience", title: "Experience" },
  { id: "assessment", title: "Career Assessment" },
  { id: "results", title: "Results" },
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const { ocAuth, authState } = useOCAuth();
  //const [ocId, setOcId] = useState();  // No longer need to track ocId in state.
  
  const [formData, setFormData] = useState({
    OCId: ocAuth?.OCId,
    account: {},
    education: {},
    skills: {},
    interests: {},
    experience: {},
    assessment: {},
  })

  // Use useCallback to prevent re-creation on every render, which avoids unnecessary re-renders in child components.
  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  // Update OCId in formData when ocAuth.OCId changes
  useEffect(() => {
    if (ocAuth?.OCId) {
      updateFormData({ OCId: ocAuth.OCId });
    }
  }, [ocAuth?.OCId, updateFormData]);

  useEffect(() => {
    console.log("Updated form data:", formData);
  }, [formData]);


  const [isProcessing, setIsProcessing] = useState(false)

  const handleNext = (data: any) => {
    const currentStepId = steps[currentStep].id;

    // Merge existing formData with the new data from the current step.
    updateFormData({ [currentStepId]: data });

    if (currentStep === steps.length - 2) {
      // Before showing results, simulate AI processing
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setCurrentStep(currentStep + 1)
      }, 3000)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const renderStep = () => {
    const stepProps = {
      onSubmit: handleNext,
      formData: formData[steps[currentStep].id],  // Pass relevant form data to each step
    };

    switch (steps[currentStep].id) {
      case "education":
        return <EducationForm {...stepProps} />
      case "skills":
        return <SkillsForm {...stepProps} />
      case "interests":
        return <InterestsForm {...stepProps} />
      case "experience":
        return <ExperienceForm {...stepProps} />
      case "assessment":
        return <CareerAssessment {...stepProps} />
      case "results":
        return <ProcessingResults formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black/[0.96] antialiased  pt-20 bg-grid-white/[0.02]">
     
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">
                {currentStep === steps.length - 1 ? "Your Career Recommendations" : "Create Your Profile"}
              </h1>
              <div className="text-sm text-white/60">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            {currentStep < steps.length - 1 && (
              <div className="mt-4 overflow-hidden rounded-full bg-[#DDDDFB]/20">
                <div
                  className="h-2 rounded-full bg-[#1418EB] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center rounded-full px-3 py-1 text-sm ${
                  index === currentStep
                    ? "bg-[#1418EB] text-white"
                    : index < currentStep
                      ? "bg-[#DDDDFB]/20 text-white"
                      : "bg-black/50 text-white/40"
                }`}
              >
                {index < currentStep && <CheckCircle className="mr-1 h-3 w-3" />}
                {step.title}
              </div>
            ))}
          </div>

          <Card className="border-[#DDDDFB]/20 bg-black/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">{steps[currentStep].title}</CardTitle>
              <CardDescription className="text-white/70">
                {currentStep === steps.length - 1
                  ? "Based on your profile and assessment, here are your personalized career recommendations."
                  : `Please provide your ${steps[currentStep].title.toLowerCase()} information.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative mb-4">
                    <div className="h-16 w-16 rounded-full border-4 border-[#DDDDFB]/20 border-t-[#00EDBE] animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-[#00EDBE]/20 animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">Processing Your Data</h3>
                  <p className="text-center text-white/70 max-w-md">
                    Our AI is analyzing your profile and assessment results to generate personalized career recommendations...
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <div className="px-4 py-2 rounded-full bg-black/50 border border-[#DDDDFB]/20 text-white/60 text-sm animate-pulse">
                      Analyzing Skills
                    </div>
                    <div className="px-4 py-2 rounded-full bg-black/50 border border-[#DDDDFB]/20 text-white/60 text-sm animate-pulse delay-300">
                      Matching Career Paths
                    </div>
                    <div className="px-4 py-2 rounded-full bg-black/50 border border-[#DDDDFB]/20 text-white/60 text-sm animate-pulse delay-700">
                      Generating Insights
                    </div>
                  </div>
                </div>
              ) : (
                renderStep()
              )}
            </CardContent>
          </Card>

          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="border-[#DDDDFB]/20 text-white hover:bg-[#DDDDFB]/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}