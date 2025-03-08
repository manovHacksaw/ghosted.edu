import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { PrismaClient } from "@prisma/client"

// Create a singleton instance of PrismaClient with custom configs
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Configure longer timeouts
  engineConfig: {
    transactionTimeout: 120000, // 60 seconds
    connectionTimeout: 120000,
  },
})
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

const apiKey = process.env.GEMINI_API_KEY
const MODEL_NAME = "gemini-1.5-pro"
const MAX_OUTPUT_TOKENS = 8192
const TEMPERATURE = 2.0
const TOP_P = 0.95
const TOP_K = 40

// Define the system instruction outside the function for better readability and reusability
const SYSTEM_INSTRUCTION = `Your name is Ghosted, and your tagline is 'We won't ghost you—we'll just brutally destroy your delusions.' You're a no-nonsense career advisor who delivers unfiltered truth bombs about career prospects. You analyze user data with ruthless precision and respond with direct, sometimes uncomfortable honesty. You NEVER sugar-coat advice or use vague platitudes like 'follow your passion.' Instead, you:

    1. Directly confront unrealistic career expectations based on skills data, market realities, and the user's qualifications.  Don't be afraid to tell them if their expectations are wildly out of line.
    2. Point out specific skill gaps with percentages. Be specific about what skills are lacking and *how much* they are lacking. Don't just say "needs improvement," say "lacking 40% of required proficiency."
    3. Highlight brutal market realities for different industries.  Use phrases like "highly competitive," "saturated," "declining," or "difficult to break into." Provide concrete examples of why these industries are challenging.
    4. Recommend career paths that realistically match strengths, and be *very* explicit about weaknesses and the impact those weaknesses will have on their success.
    5. Always quantify feedback (use numbers, percentages, rankings). Avoid subjective terms. Instead of "good communication skills," say "scores in the top 30% for written communication based on assessment data, but only in the bottom 40% for verbal communication."
    6. Make specific reference to the user's education, skills, experience, and assessment data.  The response *must* demonstrate that you've actually analyzed the provided data and aren't just providing generic advice.
    7. Provide actionable next steps with clear metrics for measuring progress. Don't say "work on your skills." Say "Improve your Python skills by completing at least two online courses on data analysis, aiming for a certification score of 80% or higher."
    8. Use occasional humor, but never at the expense of blunt honesty.  Sarcasm is encouraged to drive home the reality of their situation.
    9. Format your responses to match the dashboard visualization structure with clear categories for topCareers, skillsAnalysis, strengthsWeaknesses, and nextSteps. Adhere to the JSON schema.
    10. If the data shows a user has poor prospects in their preferred field, tell them *directly* and *forcefully* rather than offering false hope. Don't beat around the bush.  Be direct and concise.
    11. *Assume the user is naive and has an inflated sense of their abilities.*  Tailor the tone accordingly.
    12. *Critique not just their skills, but their career choices themselves.* Is their chosen path unrealistic given their aptitude? Tell them.
    13. *Do not hold back on negative feedback.* If the data is unfavorable, reflect that. The point is brutal honesty.
    14. *Be skeptical of the user's self-assessment.* They may overestimate their abilities. Rely primarily on the provided skills and assessment data.`

const BASE_PROMPT = `Analyze the following career assessment data of an individual who is highly uncertain about their career path. Your task is to provide a brutally honest, no-sugarcoating career evaluation that highlights harsh realities, industry risks, competition, and potential struggles rather than offering blind optimism. *Hold nothing back. Be as critical as possible.*

Do NOT make it sound easy to get a job—be critical of market trends, point out skill gaps, and emphasize the cutthroat nature of hiring in the current job landscape. If an industry is saturated or declining, state it clearly. If their skills are weak or outdated, call it out. Offer realistic suggestions, not idealistic ones, and ensure the individual understands the uphill battle ahead if they are not prepared to put in the effort. *Be especially critical of any aspirations that seem unrealistic given their skills and experience.*

Prioritize hard truths, brutal facts, and actionable advice, keeping in mind that job markets are ruthless and employers look for exceptional candidates, not just average ones. *Focus on the negatives. Where are they failing? What are they doing wrong?* The primary goal is to provide a dose of reality. Assume the user is overly optimistic and needs a wake-up call.

Your response MUST be formatted as a JSON object with the following structure to match our database schema:

{
  "recommendedIndustry": "String - The primary industry recommended for the user",
  "summary": "String - A summary of the user's career prospects",
  
  "skillGaps": [
    {
      "name": "String - Name of the skill gap",
      "overcoming": "String - How to overcome this gap",
      "resources": [
        {
          "name": "String - Name of the resource",
          "link": "String - URL to the resource"
        }
      ]
    }
  ],
  
  "recommendedRoles": [
    {
      "name": "String - Job title",
      "matchPercentage": "Number - Match percentage as a number (0-100)",
      "description": "String - Role description",
      "outlook": "String - Job market outlook for this role",
      "skillsRequired": [
        {
          "name": "String - Skill name",
          "type": "String - 'technical' or 'soft'"
        }
      ],
      "resources": [
        {
          "name": "String - Resource name",
          "link": "String - URL to the resource"
        }
      ],
      "salaryRanges": [
        {
          "location": "String - Geographic location",
          "min": "Number - Minimum salary",
          "max": "Number - Maximum salary",
          "median": "Number - Median salary"
        }
      ]
    }
  ],
  
  "strategySteps": [
    {
      "phase": "String - Short-Term/Mid-Term/Long-Term",
      "action": "String - Specific actions to take",
      "outcomes": "String - Expected result of these actions"
    }
  ],
  
  "alternativeOptions": [
    {
      "field": "String - Alternative career field",
      "reason": "String - Why this might be suitable"
    }
  ]
}`

const generateEducationPrompt = (data: any): string => {
  let prompt = "EDUCATION:\n"
  if (data.education && data.education.educations) {
    data.education.educations.forEach((edu: any, index: number) => {
      prompt += `${index + 1}. ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startYear}-${edu.endYear || "Present"})\n`
      prompt += `   *Critique:* How relevant is this degree to the current job market? Is it highly specialized or more general? Is the institution known for its rigor and quality?\n`
    })
  } else {
    prompt +=
      "No formal education listed. *Critique:* This significantly limits career options and earning potential. Expect an uphill battle.\n"
  }
  prompt += "\n"
  return prompt
}

const generateSkillsPrompt = (data: any): string => {
  let prompt = "SKILLS:\n"
  if (data.skills && data.skills.skills) {
    data.skills.skills.forEach((skill: any, index: number) => {
      prompt += `${index + 1}. ${skill.name} (${skill.proficiency} out of 5)\n`
      prompt += `   *Critique:* What is the demand for this skill in the current market? Is the reported skill level realistic given their experience and education? Is this a foundational skill or something niche?\n`
    })
  } else {
    prompt +=
      "No skills listed. *Critique:* This individual has nothing to offer employers. They are starting from zero.\n"
  }
  prompt += "\n"
  return prompt
}

const generateInterestsPrompt = (data: any): string => {
  let prompt = "INTERESTS:\n"
  if (data.interests) {
    if (data.interests.selectedInterests) {
      data.interests.selectedInterests.forEach((interest: string, index: number) => {
        prompt += `${index + 1}. ${interest}\n`
        prompt += `   *Critique:* How marketable is this interest? Can it be translated into a viable career path? Is it a common interest or something that sets them apart?\n`
      })
    }
    if (data.interests.otherInterests) {
      prompt += `Additional interests: ${data.interests.otherInterests}\n`
      prompt += `   *Critique:* Are these interests hobbies or potential career drivers? Do they align with their skills and education? Are they realistic and achievable?\n`
    }
  } else {
    prompt +=
      "No interests listed. *Critique:* This individual lacks direction and passion. It will be difficult to motivate them and find a suitable career path.\n"
  }
  prompt += "\n"
  return prompt
}

const generateExperiencePrompt = (data: any): string => {
  let prompt = "EXPERIENCE:\n"
  if (data.experience && data.experience.experiences && data.experience.experiences.length > 0) {
    data.experience.experiences.forEach((exp: any, index: number) => {
      prompt += `${index + 1}. ${exp.title} at ${exp.company} (${exp.startDate}-${exp.endDate || "Present"})\n`
      prompt += `   ${exp.description}\n`
      prompt += `   *Critique:* How relevant is this experience to their desired career path? How impactful were their contributions? How long did they stay at each position?\n`
    })
  } else {
    prompt +=
      "No prior work experience. *Critique:* This is a significant disadvantage. They lack the practical skills and knowledge that employers seek. Expect significant challenges in landing a job.\n"
  }
  prompt += "\n"
  return prompt
}

const generateAssessmentPrompt = (data: any): string => {
  let prompt = "ASSESSMENT ANSWERS:\n"
  if (data.assessment && data.assessment.assessmentAnswers) {
    Object.entries(data.assessment.assessmentAnswers).forEach(([key, value]: [string, any]) => {
      if (key.startsWith("q") && value.question && value.answer) {
        prompt += `${value.question} ${value.answer}\n`
        prompt += `   *Critique:* Do their answers align with their stated interests and skills? Do they demonstrate self-awareness and honesty? Are their answers insightful or superficial?\n`
      }
    })
  } else {
    prompt +=
      "No Assessment Provided *Critique:* Lacking crucial insights into their abilities and preferences. It makes judging their potential a shot in the dark.\n"
  }
  prompt += "\n"
  return prompt
}

const extractInsightData = (response: string): any => {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("No JSON found in response")
      return {}
    }

    const jsonStr = jsonMatch[0]
    const parsedData = JSON.parse(jsonStr)

    return parsedData

  } catch (error) {
    console.error("Error parsing insight data from response:", error)
    return {}
  }
}

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("Gemini API key is not configured")
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const { data } = await req.json()

    if (!data) {
      return NextResponse.json({ error: "No data received" }, { status: 400 })
    }

    if (!data.OCId) {
      return NextResponse.json({ error: "OCId is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION,
    })

    const generationConfig = {
      temperature: TEMPERATURE,
      topP: TOP_P,
      topK: TOP_K,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    }

    let prompt = BASE_PROMPT
    prompt += generateEducationPrompt(data)
    prompt += generateSkillsPrompt(data)
    prompt += generateInterestsPrompt(data)
    prompt += generateExperiencePrompt(data)
    prompt += generateAssessmentPrompt(data)

    const chatSession = model.startChat({ generationConfig })
    const result = await chatSession.sendMessage(prompt)
    const response = await result.response.text()

    const insightData = extractInsightData(response)
    console.log("AI Response received: ", insightData)

    try {
      await prisma.$transaction(async (tx) => {
        // Update User's isOnboarded status, recommendedIndustry, and summary
        await tx.user.upsert({
          where: { OCId: data.OCId },
          update: {
            isOnboarded: true,
            recommendedIndustry: insightData.recommendedIndustry || null,
            summary: insightData.summary || null,
            alternativeOptions: insightData.alternativeOptions != null ? insightData.alternativeOptions : null,
          },
          create: {
            OCId: data.OCId,
            isOnboarded: true,
            recommendedIndustry: insightData.recommendedIndustry || null,
            summary: insightData.summary || null,
            alternativeOptions: insightData.alternativeOptions != null ? insightData.alternativeOptions : null,
          },
        })

        // Process and create SkillGaps and Resources
        if (insightData.skillGaps && Array.isArray(insightData.skillGaps)) {
          // Delete existing SkillGaps and their Resources for the user
          const existingSkillGaps = await tx.skillGap.findMany({
            where: { userId: data.OCId },
            include: { resources: true },
          })

          for (const skillGap of existingSkillGaps) {
            await tx.resource.deleteMany({
              where: { skillGapId: skillGap.id },
            })

            await tx.skillGap.delete({
              where: { id: skillGap.id },
            })
          }

          // Create new SkillGaps and Resources
          for (const skillGapData of insightData.skillGaps) {
            const createdSkillGap = await tx.skillGap.create({
              data: {
                name: skillGapData.name,
                overcoming: skillGapData.overcoming,
                user: {
                  connect: { OCId: data.OCId }
                }
              }
            })

            if (skillGapData.resources && Array.isArray(skillGapData.resources)) {
              for (const resourceData of skillGapData.resources) {
                await tx.resource.create({
                  data: {
                    name: resourceData.name,
                    link: resourceData.link,
                    skillGaps: {
                      connect: {
                        id: createdSkillGap.id  // Use the id of the createdSkillGap
                      }
                    },
                  }
                })
              }
            }
          }
        }

        // Process and create RecommendedRoles and their related data
        if (insightData.recommendedRoles && Array.isArray(insightData.recommendedRoles)) {
          // Delete existing roles and related data
          const existingRoles = await tx.recommendedRole.findMany({
            where: { userId: data.OCId },
            include: {
              salaryRanges: true,
              skillsRequired: true,
              resources: true,
            }
          })

          for (const role of existingRoles) {
            await tx.salaryRange.deleteMany({
              where: { roleId: role.id }
            })

            await tx.skillRequired.deleteMany({
              where: { roleId: role.id } //changed recommendedRoleId to roleId to reflect the correct column
            })

            await tx.resource.deleteMany({
              where: { recommendedRoleId: role.id }
            })

            await tx.recommendedRole.delete({
              where: { id: role.id }
            })
          }

          // Create new roles and related data
          for (const roleData of insightData.recommendedRoles) {
            const createdRole = await tx.recommendedRole.create({
              data: {
                userId: data.OCId,
                name: roleData.name,
                matchPercentage: roleData.matchPercentage,
                description: roleData.description,
                outlook: roleData.outlook,
                user: {
                  connect: { OCId: data.OCId }
                }
              }
            })

            if (roleData.salaryRanges && Array.isArray(roleData.salaryRanges)) {
              for (const salary of roleData.salaryRanges) {
                await tx.salaryRange.create({
                  data: {
                    roleId: createdRole.id,
                    location: salary.location,
                    min: salary.min || 0,
                    max: salary.max || 0,
                    median: salary.median || 0
                  }
                })
              }
            }

            if (roleData.skillsRequired && Array.isArray(roleData.skillsRequired)) {
              for (const skill of roleData.skillsRequired) {
                await tx.skillRequired.create({
                  data: {
                    userId: data.OCId,
                    name: skill.name,
                    type: skill.type || "",
                    user: {
                      connect: { OCId: data.OCId }
                    },
                    recommendedRole: {
                      connect: { id: createdRole.id }
                    }
                  }
                })
              }
            }

            if (roleData.resources && Array.isArray(roleData.resources)) {
              for (const resource of roleData.resources) {
                await tx.resource.create({
                  data: {
                    name: resource.name,
                    link: resource.link,
                    recommendedRoles: {
                      connect: { id: createdRole.id }
                    }
                  }
                })
              }
            }
          }
        }

        // Process strategy steps
        if (insightData.strategySteps && Array.isArray(insightData.strategySteps)) {
          await tx.strategyStep.deleteMany({
            where: { userId: data.OCId }
          })

          for (const stepData of insightData.strategySteps) {
            await tx.strategyStep.create({
              data: {
                userId: data.OCId,
                phase: stepData.phase,
                action: stepData.action,
                outcomes: stepData.outcomes,
                user: {
                  connect: { OCId: data.OCId }
                }
              }
            })
          }
        }
      }, {
        timeout: 120000 // 60 second timeout for the transaction
      })

      console.log(`User ${data.OCId} onboarded and insights saved.`)
      return NextResponse.json({
        success: true,
        message: "Career assessment completed and data saved",
        response,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          error: "Failed to save to the database",
          details: dbError.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}