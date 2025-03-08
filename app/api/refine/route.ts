import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const { text, context } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set")
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Please refine and improve the following ${context} to make it more professional and impactful. Keep the same information but enhance the language and structure. Make it concise and clear:

${text}

Please provide only the refined text without any additional commentary or explanations.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const refinedText = response.text()

    if (!refinedText) {
      throw new Error("No response from Gemini API")
    }

    return NextResponse.json({ refinedText })
  } catch (error) {
    console.error("Error refining text:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to refine text" },
      { status: 500 }
    )
  }
}