import { processText } from "../lib/api"
import { EditorSettings } from "@/components/editor-settings"
import { ThemeProvider } from "@/components/theme-provider"
import { useAtom } from "jotai"
import { inputTextAtom, outputTextAtom, modelAtom, apiKeyAtom } from "@/store/settings"
import { useState } from "react"
import { temperatureAtom } from "@/store/settings"
import { EditorArea } from "@/components/editor-area"
import { EditorActions } from "@/components/editor-actions"
import { EditorHeader } from "@/components/editor-header"

export default function AIEditor() {
  const [inputText, setInputText] = useAtom(inputTextAtom)
  const [outputText, setOutputText] = useAtom(outputTextAtom)
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [model, setModel] = useAtom(modelAtom)
  const [temperature, setTemperature] = useAtom(temperatureAtom)

  async function handleAction(inputTextParam?: string) {
    if (!inputTextParam) return;
    if (!apiKey) {
      setOutputText("Please enter an API key first.");
      return;
    }

    try {
      setOutputText("")
      setIsProcessing(true)
      const result = processText(inputTextParam + "\n" + "Please do not add any other text, just the generated text.", apiKey, model, temperature);
      for await (const chunk of result.textStream) {
        setOutputText((prev) => prev + chunk)
      }
      setIsProcessing(false)
    } catch (error) {
      console.error("Error processing text:", error);
      setOutputText("An error occurred while processing your request. The error is: " + error);
      setIsProcessing(false)
    }
  }

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4 space-y-6 max-w-6xl">
          {/* Header with Theme Toggle */}
          <EditorHeader />

          {/* Settings Section */}
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
            inputText={inputText}
            onAction={handleAction}
          />

          <EditorArea
            inputText={inputText}
            outputText={outputText}
            apiKey={apiKey}
            onInputChange={setInputText}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

