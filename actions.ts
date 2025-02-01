"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function processText(text: string, action: string, value?: string, apiKey?: string, model?: string) {
  if (!apiKey) {
    throw new Error("API key is required")
  }

  try {
    let prompt = ""
    switch (action) {
      case "change-tone":
        prompt = `Please rewrite the following text in a ${value || "professional"} tone:\n\n${text}`
        break
      case "translate":
        const languageMap: Record<string, string> = {
          en: "English",
          es: "Spanish",
          fr: "French",
          de: "German",
          it: "Italian",
          pt: "Portuguese",
          ru: "Russian",
          ja: "Japanese",
          ko: "Korean",
          zh: "Chinese",
        }
        const targetLanguage = languageMap[value || "en"]
        prompt = `Please translate the following text to ${targetLanguage}:\n\n${text}`
        break
      case "compose-reply":
        prompt = `Please compose a reply to the following message:\n\n${text}`
        break
      case "summarize":
        prompt = `Please provide a concise summary of the following text:\n\n${text}`
        break
      default:
        return text
    }

    const { text: generatedText } = await generateText({
      model: openai(model || "gpt-4"),
      prompt,
    })

    return generatedText
  } catch (error) {
    console.error("Error processing text:", error)
    throw error
  }
}

