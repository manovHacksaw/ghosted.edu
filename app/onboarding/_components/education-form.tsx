"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface EducationFormProps {
  onSubmit: (data: any) => void
}

interface Education {
  institution: string;
  city: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  currentlyStudying: boolean;
}

export function EducationForm({ onSubmit }: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>([
    {
      institution: "",
      city: "",
      degree: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      currentlyStudying: false,
    },
  ])

  const handleChange = (index: number, field: string, value: string | boolean) => {
    const updatedEducations = [...educations]
    updatedEducations[index] = { ...updatedEducations[index], [field]: value }
    setEducations(updatedEducations)
  }

  const handleAddEducation = () => {
    setEducations([
      ...educations,
      {
        institution: "",
        city: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyStudying: false,
      },
    ])
  }

  const handleRemoveEducation = (index: number) => {
    if (educations.length > 1) {
      const updatedEducations = educations.filter((_, i) => i !== index)
      setEducations(updatedEducations)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ educations })
  }

  const handleCurrentlyStudyingChange = (index: number, checked: boolean) => {
    const updatedEducations = [...educations];
    updatedEducations[index] = {
      ...updatedEducations[index],
      currentlyStudying: checked,
      endYear: checked ? "" : updatedEducations[index].endYear, // Clear endYear if checking, keep if unchecking
    };
    setEducations(updatedEducations);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {educations.map((education, index) => (
        <div key={index} className="rounded-lg border border-[#DDDDFB]/20 bg-black/50 backdrop-blur-md p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Education #{index + 1}</h3>
            {educations.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveEducation(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`institution-${index}`} className="text-white">Institution</Label>
              <Input
                id={`institution-${index}`}
                placeholder="University/College/School Name"
                value={education.institution}
                onChange={(e) => handleChange(index, "institution", e.target.value)}
                required
                className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`city-${index}`} className="text-white">City</Label>
              <Input
                id={`city-${index}`}
                placeholder="e.g., New York"
                value={education.city}
                onChange={(e) => handleChange(index, "city", e.target.value)}
                className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
                required
              />
            </div>


            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`} className="text-white">Degree</Label>
                <Select onValueChange={(value) => handleChange(index, "degree", value)} defaultValue={education.degree}>
                  <SelectTrigger id={`degree-${index}`} className="bg-black/50 border-[#DDDDFB]/20 text-white">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-[#DDDDFB]/20">
                    <SelectItem value="high_school" className="text-white">High School</SelectItem>
                    <SelectItem value="associate" className="text-white">Associate's Degree</SelectItem>
                    <SelectItem value="bachelor" className="text-white">Bachelor's Degree</SelectItem>
                    <SelectItem value="master" className="text-white">Master's Degree</SelectItem>
                    <SelectItem value="doctorate" className="text-white">Doctorate</SelectItem>
                    <SelectItem value="other" className="text-white">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`field-${index}`} className="text-white">Field of Study</Label>
                <Input
                  id={`field-${index}`}
                  placeholder="e.g. Computer Science"
                  value={education.fieldOfStudy}
                  onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                  className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`start-year-${index}`} className="text-white">Start Year</Label>
                <Input
                  id={`start-year-${index}`}
                  placeholder="YYYY"
                  value={education.startYear}
                  onChange={(e) => handleChange(index, "startYear", e.target.value)}
                  required
                  className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
                  type="number"
                  minLength={4}
                  maxLength={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`end-year-${index}`} className="text-white">End Year (or Expected)</Label>
                <Input
                  id={`end-year-${index}`}
                  placeholder="YYYY"
                  value={education.endYear}
                  onChange={(e) => handleChange(index, "endYear", e.target.value)}
                  required={!education.currentlyStudying}
                  className="bg-black/50 border-[#DDDDFB]/20 text-white placeholder:text-white/50"
                  type="number"
                  minLength={4}
                  maxLength={4}
                  disabled={education.currentlyStudying}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`currently-studying-${index}`}
                checked={education.currentlyStudying}
                onCheckedChange={(checked) => {
                    handleCurrentlyStudyingChange(index, checked || false);
                }}
                className="border-[#DDDDFB]/20 bg-black/50 text-white"
              />
              <Label htmlFor={`currently-studying-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-white">
                Currently Studying
              </Label>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddEducation}
        className="w-full border-dashed border-[#DDDDFB]/20 text-white hover:bg-[#DDDDFB]/10"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Another Education
      </Button>

      <Button type="submit" className="w-full bg-[#1418EB] text-white hover:bg-[#1418EB]/80">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}