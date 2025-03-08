"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; // Card component for enhanced UI

interface CareerAssessmentProps {
  onSubmit: (data: any) => void
}

interface AnswerType {
  question: string;
  answer: string;
}

export function CareerAssessment({ onSubmit }: CareerAssessmentProps) {
  const questions = [
    {
      id: "q1",
      question: "I prefer working with:",
      options: [
        { value: "a", label: "Data and numbers" },
        { value: "b", label: "People and relationships" },
        { value: "c", label: "Ideas and concepts" },
        { value: "d", label: "Physical objects and tools" },
      ],
    },
    {
      id: "q2",
      question: "When solving problems, I tend to:",
      options: [
        { value: "a", label: "Analyze data and look for patterns" },
        { value: "b", label: "Discuss with others to find solutions" },
        { value: "c", label: "Think creatively and outside the box" },
        { value: "d", label: "Take a hands-on, practical approach" },
      ],
    },
    {
      id: "q3",
      question: "I find the most satisfaction in:",
      options: [
        { value: "a", label: "Organizing and structuring information" },
        { value: "b", label: "Helping and supporting others" },
        { value: "c", label: "Creating something new and innovative" },
        { value: "d", label: "Building or fixing things" },
      ],
    },
    {
      id: "q4",
      question: "In a team, I usually take on the role of:",
      options: [
        { value: "a", label: "The analyst who examines the details" },
        { value: "b", label: "The communicator who keeps everyone connected" },
        { value: "c", label: "The visionary who generates new ideas" },
        { value: "d", label: "The implementer who gets things done" },
      ],
    },
    {
      id: "q5",
      question: "I learn best by:",
      options: [
        { value: "a", label: "Reading and researching" },
        { value: "b", label: "Discussing and collaborating" },
        { value: "c", label: "Exploring and experimenting" },
        { value: "d", label: "Doing and practicing" },
      ],
    },
    {
      id: "q6",
      question: "I value work environments that:",
      options: [
        { value: "a", label: "Are structured and organized" },
        { value: "b", label: "Promote teamwork and collaboration" },
        { value: "c", label: "Encourage innovation and creativity" },
        { value: "d", label: "Allow for independence and autonomy" },
      ],
    },
    {
      id: "q7",
      question: "I'm most motivated by:",
      options: [
        { value: "a", label: "Achieving measurable results" },
        { value: "b", label: "Making a positive impact on others" },
        { value: "c", label: "Exploring new possibilities" },
        { value: "d", label: "Mastering practical skills" },
      ],
    },
    {
      id: "q8",
      question: "When faced with a challenge, I typically:",
      options: [
        { value: "a", label: "Break it down into smaller, manageable parts" },
        { value: "b", label: "Seek advice and input from others" },
        { value: "c", label: "Look for alternative, unconventional solutions" },
        { value: "d", label: "Roll up my sleeves and tackle it head-on" },
      ],
    },
    {
      id: "q9",
      question: "I prefer jobs that involve:",
      options: [
        { value: "a", label: "Analysis, research, and planning" },
        { value: "b", label: "Teaching, counseling, or customer service" },
        { value: "c", label: "Design, writing, or strategic thinking" },
        { value: "d", label: "Building, repairing, or working outdoors" },
      ],
    },
    {
      id: "q10",
      question: "My ideal career would allow me to:",
      options: [
        { value: "a", label: "Solve complex problems and make data-driven decisions" },
        { value: "b", label: "Help others and make a difference in their lives" },
        { value: "c", label: "Express my creativity and innovate" },
        { value: "d", label: "Work with my hands and see tangible results" },
      ],
    },
    // Additional fresher-specific questions
    {
      id: "q11",
      question: "What salary range are you expecting for your first role?",
      options: [
        { value: "a", label: "Entry-level market rate" },
        { value: "b", label: "Above market rate" },
        { value: "c", label: "Below market rate (willing to trade for experience)" },
        { value: "d", label: "Not sure yet" },
      ],
    },
    {
      id: "q12",
      question: "How important is mentorship in your first job?",
      options: [
        { value: "a", label: "Essential priority" },
        { value: "b", label: "Important but not critical" },
        { value: "c", label: "Nice to have" },
        { value: "d", label: "I prefer learning independently" },
      ],
    },
    {
      id: "q13",
      question: "What's your preference regarding work environment?",
      options: [
        { value: "a", label: "Fully remote" },
        { value: "b", label: "Hybrid arrangement" },
        { value: "c", label: "Fully on-site" },
        { value: "d", label: "No strong preference" },
      ],
    },
    {
      id: "q14",
      question: "How do you feel about overtime or irregular hours in your first job?",
      options: [
        { value: "a", label: "Willing to put in extra hours to learn" },
        { value: "b", label: "Prefer strict work-life boundaries" },
        { value: "c", label: "Flexible but need advance notice" },
        { value: "d", label: "Depends on compensation" },
      ],
    },
    {
      id: "q15",
      question: "Which best describes your geographic flexibility for your first job?",
      options: [
        { value: "a", label: "Willing to relocate anywhere" },
        { value: "b", label: "Limited to specific regions" },
        { value: "c", label: "Not willing to relocate" },
        { value: "d", label: "Open to temporary relocation" },
      ],
    },
    {
      id: "q16",
      question: "How do you prefer to receive feedback on your work?",
      options: [
        { value: "a", label: "Regular structured meetings" },
        { value: "b", label: "Immediate informal feedback" },
        { value: "c", label: "Written detailed feedback" },
        { value: "d", label: "Mixture of approaches" },
      ],
    },
    {
      id: "q17",
      question: "What type of company size appeals to you most?",
      options: [
        { value: "a", label: "Startup/small company" },
        { value: "b", label: "Mid-size company" },
        { value: "c", label: "Large established corporation" },
        { value: "d", label: "No preference" },
      ],
    },
    {
      id: "q18",
      question: "How would you describe your readiness to start working full-time?",
      options: [
        { value: "a", label: "Ready now with sufficient skills" },
        { value: "b", label: "Need additional training but eager to start" },
        { value: "c", label: "Would prefer internship first" },
        { value: "d", label: "Still exploring options" },
      ],
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerType>>({});
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    if (formSubmitted) {
      onSubmit({ answers })
    }
  }, [answers, formSubmitted, onSubmit])

  const handleAnswer = (questionId: string, questionText: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: { question: questionText, answer: value },
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    onSubmit({
      assessmentAnswers: answers,
      completedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      questionsAnswered: Object.keys(answers).length
    })
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-white">{progress.toFixed(0)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="rounded-lg border-[#DDDDFB]/20 bg-black/50 backdrop-blur-md"> {/* Using Card Component */}
        <CardHeader>
          <h3 className="text-xl font-medium text-white">{questions[currentQuestion].question}</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={answers[questions[currentQuestion].id]?.answer || ""}
            onValueChange={(value) => handleAnswer(questions[currentQuestion].id, questions[currentQuestion].question, value)}
          >
            {questions[currentQuestion].options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${questions[currentQuestion].id}-${option.value}`}
                  className="border-[#DDDDFB]/20 text-[#00EDBE]"
                />
                <Label htmlFor={`${questions[currentQuestion].id}-${option.value}`} className="cursor-pointer font-normal text-white">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="border-[#DDDDFB]/20 text-white hover:bg-[#DDDDFB]/10"
                disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
                type="button"
                onClick={handleNext}
                className="bg-[#1418EB] text-white hover:bg-[#1418EB]/80"
                disabled={currentQuestion === questions.length - 1}
            >
                Next
            </Button>

        </CardFooter>

      </Card>


       <Button type="submit" className="w-full bg-[#1418EB] text-white hover:bg-[#1418EB]/80"  disabled={currentQuestion !== questions.length - 1}>
         Submit Assessment <ArrowRight className="ml-2 h-4 w-4" />
       </Button>


    </form>
  )
}