import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

export function processText(prompt: string, apiKey?: string, model?: string) {
  if (!apiKey) {
    throw new Error("API key is required")
  }

  try {
    const openai = createOpenAI({
      apiKey: apiKey,
    })
    const result = streamText({
      model: openai(model || "gpt-4o-mini"),
      prompt: prompt,
    })

    return result
  } catch (error) {
    console.error("Error processing text:", error)
    throw error
  }
}

