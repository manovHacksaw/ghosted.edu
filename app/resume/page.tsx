"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Plus, Trash2, User, GraduationCap, Briefcase, FolderGit2, FileText, Trophy, Wand2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { SparklesCore } from "@/components/sparkles"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function ResumeBuilder() {
  const [isRefining, setIsRefining] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  // Resume data state
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  })

  const [education, setEducation] = useState([
    { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" },
  ])

  const [experience, setExperience] = useState([
    { company: "", position: "", startDate: "", endDate: "", description: "" },
  ])

  const [projects, setProjects] = useState([{ name: "", description: "", link: "", technologies: "" }])

  const [achievements, setAchievements] = useState([
    { title: "", date: "", description: "", category: "" },
  ])

  const resumeRef = useRef(null)

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Handle education changes
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [name]: value }
    setEducation(newEducation)
  }

  // Handle experience changes
  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target
    const newExperience = [...experience]
    newExperience[index] = { ...newExperience[index], [name]: value }
    setExperience(newExperience)
  }

  // Handle project changes
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target
    const newProjects = [...projects]
    newProjects[index] = { ...newProjects[index], [name]: value }
    setProjects(newProjects)
  }

  // Handle achievement changes
  const handleAchievementChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newAchievements = [...achievements]
    newAchievements[index] = { ...newAchievements[index], [name]: value }
    setAchievements(newAchievements)
  }

  // Add new education entry
  const addEducation = () => {
    setEducation([
      ...education,
      { institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" },
    ])
  }

  // Add new experience entry
  const addExperience = () => {
    setExperience([...experience, { company: "", position: "", startDate: "", endDate: "", description: "" }])
  }

  // Add new project entry
  const addProject = () => {
    setProjects([...projects, { name: "", description: "", link: "", technologies: "" }])
  }

  // Add new achievement entry
  const addAchievement = () => {
    setAchievements([...achievements, { title: "", date: "", description: "", category: "" }])
  }

  // Remove education entry
  const removeEducation = (index) => {
    if (education.length > 1) {
      const newEducation = [...education]
      newEducation.splice(index, 1)
      setEducation(newEducation)
    }
  }

  // Remove experience entry
  const removeExperience = (index) => {
    if (experience.length > 1) {
      const newExperience = [...experience]
      newExperience.splice(index, 1)
      setExperience(newExperience)
    }
  }

  // Remove project entry
  const removeProject = (index) => {
    if (projects.length > 1) {
      const newProjects = [...projects]
      newProjects.splice(index, 1)
      setProjects(newProjects)
    }
  }

  // Remove achievement entry
  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      const newAchievements = [...achievements]
      newAchievements.splice(index, 1)
      setAchievements(newAchievements)
    }
  }

  const downloadPDF = async () => {
    try {
      const resumeElement = document.getElementById('resume-preview');
      if (!resumeElement) return;

      // Show loading state
      setIsRefining(true);
      showNotification('Generating PDF...', 'info');

      // Create canvas from resume element
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm

      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      // Add additional pages if content overflows
      let heightLeft = imgHeight;
      let position = 0;
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save('resume.pdf');
      showNotification('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsRefining(false);
    }
  };

  // Function to show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Function to refine text using Gemini
  const refineText = async (text: string, context: string) => {
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine text')
      }

      if (!data.refinedText) {
        throw new Error('No refined text received')
      }

      return data.refinedText
    } catch (error) {
      console.error('Error refining text:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to refine text'
      showNotification('error', `Error: ${errorMessage}`)
      return text
    }
  }

  // Function to refine all sections
  const refineAllSections = async () => {
    setIsRefining(true)
    try {
      let refinedCount = 0
      let totalSections = 0

      // Refine summary
      if (personalInfo.summary) {
        totalSections++
        const refinedSummary = await refineText(personalInfo.summary, "professional summary")
        if (refinedSummary !== personalInfo.summary) {
          setPersonalInfo(prev => ({ ...prev, summary: refinedSummary }))
          refinedCount++
        }
      }

      // Refine experience descriptions
      for (const exp of experience) {
        if (exp.description) {
          totalSections++
          const refinedDesc = await refineText(exp.description, "work experience")
          if (refinedDesc !== exp.description) {
            exp.description = refinedDesc
            refinedCount++
          }
        }
      }

      // Refine project descriptions
      for (const project of projects) {
        if (project.description) {
          totalSections++
          const refinedDesc = await refineText(project.description, "project description")
          if (refinedDesc !== project.description) {
            project.description = refinedDesc
            refinedCount++
          }
        }
      }

      // Refine achievement descriptions
      for (const achievement of achievements) {
        if (achievement.description) {
          totalSections++
          const refinedDesc = await refineText(achievement.description, "achievement description")
          if (refinedDesc !== achievement.description) {
            achievement.description = refinedDesc
            refinedCount++
          }
        }
      }

      if (refinedCount > 0) {
        showNotification('success', `Successfully refined ${refinedCount} out of ${totalSections} sections!`)
      } else {
        showNotification('error', 'No sections were refined. Please check your content and try again.')
      }
    } catch (error) {
      console.error('Error refining sections:', error)
      showNotification('error', 'Failed to refine sections. Please try again.')
    } finally {
      setIsRefining(false)
    }
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden pt-20">
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

      <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Resume Builder</h1>
          <div className="flex items-center gap-4">
            {notification && (
              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                notification.type === 'success' 
                  ? 'bg-[#00EDBE]/20 text-[#00EDBE] border border-[#00EDBE]/30' 
                  : notification.type === 'error' 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                    : 'bg-teal-500/20 text-teal-500 border border-teal-500/30'
              } transition-all duration-300`}>
                {notification.message}
              </div>
            )}
            <Button 
              onClick={refineAllSections} 
              disabled={isRefining}
              className="flex items-center gap-2 bg-[#00EDBE] hover:bg-[#00EDBE]/80 text-black"
            >
              <Wand2 className="h-4 w-4" />
              {isRefining ? "Refining..." : "Refine Content"}
            </Button>
            <Button 
              onClick={downloadPDF}
              disabled={isRefining}
              className="flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isRefining ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="personal" className="flex items-center gap-1 text-white">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-1 text-white">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-1 text-white">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-1 text-white">
                  <FolderGit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Projects</span>
                </TabsTrigger>
                <TabsTrigger value="achievements" className="flex items-center gap-1 text-white">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal" className="space-y-4">
                <h2 className="text-xl font-semibold mb-2 text-white">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={personalInfo.title}
                      onChange={handlePersonalInfoChange}
                      placeholder="Software Engineer"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="john.doe@example.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="(123) 456-7890"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={personalInfo.location}
                      onChange={handlePersonalInfoChange}
                      placeholder="New York, NY"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="summary" className="text-white">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      value={personalInfo.summary}
                      onChange={handlePersonalInfoChange}
                      placeholder="A brief summary of your professional background and skills"
                      rows={4}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Education</h2>
                  <Button onClick={addEducation} size="sm" className="flex items-center gap-1 bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {education.map((edu, index) => (
                  <Card key={index} className="relative bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEducation(index)}
                          disabled={education.length <= 1}
                          className="h-8 w-8 text-destructive hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${index}`} className="text-white">Institution</Label>
                          <Input
                            id={`institution-${index}`}
                            name="institution"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, e)}
                            placeholder="University Name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`degree-${index}`} className="text-white">Degree</Label>
                          <Input
                            id={`degree-${index}`}
                            name="degree"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, e)}
                            placeholder="Bachelor of Science"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`field-${index}`} className="text-white">Field of Study</Label>
                          <Input
                            id={`field-${index}`}
                            name="field"
                            value={edu.field}
                            onChange={(e) => handleEducationChange(index, e)}
                            placeholder="Computer Science"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${index}`} className="text-white">Start Date</Label>
                            <Input
                              id={`startDate-${index}`}
                              name="startDate"
                              value={edu.startDate}
                              onChange={(e) => handleEducationChange(index, e)}
                              placeholder="Sep 2018"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${index}`} className="text-white">End Date</Label>
                            <Input
                              id={`endDate-${index}`}
                              name="endDate"
                              value={edu.endDate}
                              onChange={(e) => handleEducationChange(index, e)}
                              placeholder="May 2022 or Present"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`description-${index}`} className="text-white">Description</Label>
                          <Textarea
                            id={`description-${index}`}
                            name="description"
                            value={edu.description}
                            onChange={(e) => handleEducationChange(index, e)}
                            placeholder="Relevant coursework, achievements, etc."
                            rows={3}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Work Experience</h2>
                  <Button onClick={addExperience} size="sm" className="flex items-center gap-1 bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {experience.map((exp, index) => (
                  <Card key={index} className="relative bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExperience(index)}
                          disabled={experience.length <= 1}
                          className="h-8 w-8 text-destructive hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`company-${index}`} className="text-white">Company</Label>
                          <Input
                            id={`company-${index}`}
                            name="company"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, e)}
                            placeholder="Company Name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`position-${index}`} className="text-white">Position</Label>
                          <Input
                            id={`position-${index}`}
                            name="position"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(index, e)}
                            placeholder="Software Engineer"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label htmlFor={`expStartDate-${index}`} className="text-white">Start Date</Label>
                            <Input
                              id={`expStartDate-${index}`}
                              name="startDate"
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(index, e)}
                              placeholder="Jan 2020"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`expEndDate-${index}`} className="text-white">End Date</Label>
                            <Input
                              id={`expEndDate-${index}`}
                              name="endDate"
                              value={exp.endDate}
                              onChange={(e) => handleExperienceChange(index, e)}
                              placeholder="Present"
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`expDescription-${index}`} className="text-white">Description</Label>
                          <Textarea
                            id={`expDescription-${index}`}
                            name="description"
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, e)}
                            placeholder="Describe your responsibilities and achievements"
                            rows={4}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Projects</h2>
                  <Button onClick={addProject} size="sm" className="flex items-center gap-1 bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {projects.map((project, index) => (
                  <Card key={index} className="relative bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeProject(index)}
                          disabled={projects.length <= 1}
                          className="h-8 w-8 text-destructive hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`projectName-${index}`} className="text-white">Project Name</Label>
                          <Input
                            id={`projectName-${index}`}
                            name="name"
                            value={project.name}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="Project Name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`projectLink-${index}`} className="text-white">Project Link</Label>
                          <Input
                            id={`projectLink-${index}`}
                            name="link"
                            value={project.link}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="https://github.com/username/project"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`technologies-${index}`} className="text-white">Technologies Used</Label>
                          <Input
                            id={`technologies-${index}`}
                            name="technologies"
                            value={project.technologies}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="React, Node.js, MongoDB"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`projectDescription-${index}`} className="text-white">Description</Label>
                          <Textarea
                            id={`projectDescription-${index}`}
                            name="description"
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, e)}
                            placeholder="Describe the project, your role, and achievements"
                            rows={3}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Achievements</h2>
                  <Button onClick={addAchievement} size="sm" className="flex items-center gap-1 bg-[#141BEB] hover:bg-[#141BEB]/80 text-white">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>

                {achievements.map((achievement, index) => (
                  <Card key={index} className="relative bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(index)}
                          disabled={achievements.length <= 1}
                          className="h-8 w-8 text-destructive hover:bg-white/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`achievementTitle-${index}`} className="text-white">Title</Label>
                          <Input
                            id={`achievementTitle-${index}`}
                            name="title"
                            value={achievement.title}
                            onChange={(e) => handleAchievementChange(index, e)}
                            placeholder="e.g., Best Employee Award"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`achievementDate-${index}`} className="text-white">Date</Label>
                          <Input
                            id={`achievementDate-${index}`}
                            name="date"
                            value={achievement.date}
                            onChange={(e) => handleAchievementChange(index, e)}
                            placeholder="e.g., 2023"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`achievementCategory-${index}`} className="text-white">Category</Label>
                          <Input
                            id={`achievementCategory-${index}`}
                            name="category"
                            value={achievement.category}
                            onChange={(e) => handleAchievementChange(index, e)}
                            placeholder="e.g., Professional, Academic, Sports"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`achievementDescription-${index}`} className="text-white">Description</Label>
                          <Textarea
                            id={`achievementDescription-${index}`}
                            name="description"
                            value={achievement.description}
                            onChange={(e) => handleAchievementChange(index, e)}
                            placeholder="Describe your achievement and its significance"
                            rows={3}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                Resume Preview
              </h2>
            </div>

            <div
              ref={resumeRef}
              className="bg-white p-8 min-h-[842px] w-full max-w-[595px] mx-auto shadow-sm border border-white/10"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {/* Resume Header */}
              {personalInfo.name && (
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-black tracking-tight mb-2">{personalInfo.name}</h1>
                  {personalInfo.title && (
                    <p className="text-xl text-gray-700 font-medium mb-3">{personalInfo.title}</p>
                  )}

                  <div className="flex flex-wrap justify-center gap-x-6 text-sm text-gray-600">
                    {personalInfo.email && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {personalInfo.email}
                      </span>
                    )}
                    {personalInfo.phone && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {personalInfo.phone}
                      </span>
                    )}
                    {personalInfo.location && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {personalInfo.location}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {personalInfo.summary && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-3 text-black">Professional Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
                </div>
              )}

              {/* Experience */}
              {experience.some((exp) => exp.company || exp.position) && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4 text-black">Professional Experience</h2>
                  {experience.map(
                    (exp, index) =>
                      (exp.company || exp.position) && (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              {exp.position && <h3 className="font-semibold text-black text-base">{exp.position}</h3>}
                              {exp.company && <p className="text-sm text-gray-700 font-medium">{exp.company}</p>}
                            </div>
                            {(exp.startDate || exp.endDate) && (
                              <p className="text-sm text-gray-600 font-medium">
                                {exp.startDate}
                                {exp.startDate && exp.endDate && " - "}
                                {exp.endDate}
                              </p>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}

              {/* Education */}
              {education.some((edu) => edu.institution || edu.degree) && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4 text-black">Education</h2>
                  {education.map(
                    (edu, index) =>
                      (edu.institution || edu.degree) && (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              {edu.institution && <h3 className="font-semibold text-black text-base">{edu.institution}</h3>}
                              {(edu.degree || edu.field) && (
                                <p className="text-sm text-gray-700 font-medium">
                                  {edu.degree}
                                  {edu.degree && edu.field && ", "}
                                  {edu.field}
                                </p>
                              )}
                            </div>
                            {(edu.startDate || edu.endDate) && (
                              <p className="text-sm text-gray-600 font-medium">
                                {edu.startDate}
                                {edu.startDate && edu.endDate && " - "}
                                {edu.endDate}
                              </p>
                            )}
                          </div>
                          {edu.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">{edu.description}</p>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}

              {/* Projects */}
              {projects.some((project) => project.name) && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4 text-black">Projects</h2>
                  {projects.map(
                    (project, index) =>
                      project.name && (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-black text-base">
                              {project.name}
                              {project.link && (
                                <span className="font-normal text-sm ml-2">
                                  (
                                  <a
                                    href={project.link}
                                    className="text-blue-600 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Project
                                  </a>
                                  )
                                </span>
                              )}
                            </h3>
                          </div>
                          {project.technologies && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Technologies:</span> {project.technologies}
                            </p>
                          )}
                          {project.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}

              {/* Achievements */}
              {achievements.some((achievement) => achievement.title) && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4 text-black">Achievements</h2>
                  {achievements.map(
                    (achievement, index) =>
                      achievement.title && (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-black text-base">{achievement.title}</h3>
                              {achievement.category && (
                                <p className="text-sm text-gray-700 font-medium">{achievement.category}</p>
                              )}
                            </div>
                            {achievement.date && (
                              <p className="text-sm text-gray-600 font-medium">{achievement.date}</p>
                            )}
                          </div>
                          {achievement.description && (
                            <p className="text-sm text-gray-700 leading-relaxed">{achievement.description}</p>
                          )}
                        </div>
                      ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
