import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function processText(prompt: string, apiKey?: string, model?: string) {
  if (!apiKey) {
    throw new Error("API key is required")
  }

  try {
    const openai = createOpenAI({
      apiKey: apiKey,
    })
    const { text: generatedText } = await generateText({
      model: openai(model || "gpt-4o-mini"),
      prompt: prompt,
    })

    return generatedText
  } catch (error) {
    console.error("Error processing text:", error)
    throw error
  }
}

