import { processText } from "../lib/api"
import { EditorSettings } from "@/components/editor-settings"
import { ThemeProvider } from "@/components/theme-provider"
import { useAtom } from "jotai"
import { inputTextsAtom, outputTextsAtom, modelAtom, apiKeyAtom, currentOutputIndexAtom } from "@/store/settings"
import { useState } from "react"
import { temperatureAtom } from "@/store/settings"
import { EditorArea } from "@/components/editor-area/editor-area"
import { EditorActions } from "@/components/editor-actions"
import { EditorHeader } from "@/components/editor-header"

export default function AIEditor() {
  const [inputTexts] = useAtom(inputTextsAtom)
  const [outputTexts, setOutputTexts] = useAtom(outputTextsAtom)
  const [, setCurrentOutputIndex] = useAtom(currentOutputIndexAtom)
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [model, setModel] = useAtom(modelAtom)
  const [temperature, setTemperature] = useAtom(temperatureAtom)

  const currentInputText = inputTexts[inputTexts.length - 1] || ""

  async function handleAction(inputTextParam?: string) {
    if (!inputTextParam) return;
    if (!apiKey) {
      setOutputTexts(prev => [...prev, "Please enter an API key first."])
      setCurrentOutputIndex(prev => prev + 1)
      return;
    }

    try {
      let newOutput = ""
      setIsProcessing(true)
      const result = processText(inputTextParam + "\n" + "Please do not add any other text, just the generated text.", apiKey, model, temperature);
      
      // Create a temporary state for showing streaming output
      const tempIndex = outputTexts.length
      setOutputTexts(prev => [...prev, ""])
      setCurrentOutputIndex(tempIndex)

      for await (const chunk of result.textStream) {
        newOutput += chunk
        // Update only the current streaming output
        setOutputTexts(prev => {
          const updated = [...prev]
          updated[tempIndex] = newOutput
          return updated
        })
      }
      setIsProcessing(false)
    } catch (error) {
      console.error("Error processing text:", error);
      const errorMessage = "An error occurred while processing your request. The error is: " + error
      setOutputTexts(prev => [...prev, errorMessage])
      setCurrentOutputIndex(prev => prev + 1)
      setIsProcessing(false)
    }
  }

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4 space-y-6 max-w-6xl">
          <EditorHeader />

          <EditorSettings
            apiKey={apiKey}
            model={model}
            temperature={temperature}
            onApiKeyChange={setApiKey}
            onModelChange={setModel}
            onTemperatureChange={setTemperature}
          />

          <EditorActions
            isProcessing={isProcessing}
            inputText={currentInputText}
            onAction={handleAction}
          />

          <EditorArea />
        </div>
      </div>
    </ThemeProvider>
  )
}

