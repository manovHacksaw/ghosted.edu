"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InterestsFormProps {
  onSubmit: (data: any) => void
}

export function InterestsForm({ onSubmit }: InterestsFormProps) {
  const interestCategories = [
    {
      name: "Technology",
      options: [
        "Software Development",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Web Development",
        "Mobile App Development",
        "Cloud Computing",
        "Blockchain",
      ],
    },
    {
      name: "Business",
      options: [
        "Entrepreneurship",
        "Marketing",
        "Finance",
        "Management",
        "Consulting",
        "Sales",
        "Human Resources",
        "Project Management",
      ],
    },
    {
      name: "Creative",
      options: [
        "Graphic Design",
        "UI/UX Design",
        "Content Creation",
        "Writing",
        "Video Production",
        "Photography",
        "Animation",
        "Music Production",
      ],
    },
    {
      name: "Healthcare",
      options: [
        "Medicine",
        "Nursing",
        "Public Health",
        "Mental Health",
        "Physical Therapy",
        "Nutrition",
        "Healthcare Management",
        "Biomedical Research",
      ],
    },
  ]

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [otherInterests, setOtherInterests] = useState("")

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ selectedInterests, otherInterests })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {interestCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="rounded-lg border border-[#DDDDFB]/20 bg-black/50 backdrop-blur-md p-4">
            <h3 className="mb-4 text-lg font-medium text-white">{category.name}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {category.options.map((interest, interestIndex) => (
                <div key={interestIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${categoryIndex}-${interestIndex}`}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                    className="border-[#DDDDFB]/20 data-[state=checked]:bg-[#00EDBE] data-[state=checked]:border-[#00EDBE]"
                  />
                  <Label
                    htmlFor={`interest-${categoryIndex}-${interestIndex}`}
                    className="cursor-pointer text-sm font-normal text-white"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-lg border border-[#DDDDFB]/20 bg-black/50 backdrop-blur-md p-4">
          <h3 className="mb-4 text-lg font-medium text-white">Other Interests</h3>
          <Textarea
            placeholder="Tell us about any other interests or hobbies that aren't listed above..."
            value={otherInterests}
            onChange={(e) => setOtherInterests(e.target.value)}
            className="min-h-[100px] bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-[#1418EB] text-white hover:bg-[#1418EB]/80">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
