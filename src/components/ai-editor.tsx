import { processText } from "../lib/api"
import { EditorSettings } from "@/components/editor-settings"
import { ThemeProvider } from "@/components/theme-provider"
import { useAtom } from "jotai"
import { inputTextsAtom, currentInputIndexAtom, outputTextsAtom, modelAtom, apiKeyAtom, currentOutputIndexAtom } from "@/store/settings"
import { useState } from "react"
import { temperatureAtom } from "@/store/settings"
import { EditorArea } from "@/components/editor-area/editor-area"
import { EditorActions } from "@/components/editor-actions"
import { EditorHeader } from "@/components/editor-header"

export default function AIEditor() {
  const [inputTexts, setInputTexts] = useAtom(inputTextsAtom)
  const [currentInputIndex, setCurrentInputIndex] = useAtom(currentInputIndexAtom)
  const [outputTexts, setOutputTexts] = useAtom(outputTextsAtom)
  const [currentOutputIndex, setCurrentOutputIndex] = useAtom(currentOutputIndexAtom)
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [model, setModel] = useAtom(modelAtom)
  const [temperature, setTemperature] = useAtom(temperatureAtom)

  const currentInputText = inputTexts[currentInputIndex] || ""
  const currentOutputText = outputTexts[currentOutputIndex] || ""

  const handleInputChange = (value: string) => {
    if (currentInputIndex === -1) {
      setInputTexts([value])
      setCurrentInputIndex(0)
    } else {
      setInputTexts(prev => {
        const updated = [...prev]
        updated[currentInputIndex] = value
        return updated
      })
    }
  }

  const handleNavigateInput = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentInputIndex > 0) {
      setCurrentInputIndex(currentInputIndex - 1)
    } else if (direction === 'next' && currentInputIndex < inputTexts.length - 1) {
      setCurrentInputIndex(currentInputIndex + 1)
    }
  }

  const handleNavigateOutput = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentOutputIndex > 0) {
      setCurrentOutputIndex(currentOutputIndex - 1)
    } else if (direction === 'next' && currentOutputIndex < outputTexts.length - 1) {
      setCurrentOutputIndex(currentOutputIndex + 1)
    }
  }

  const handleClearHistory = () => {
    setOutputTexts([])
    setCurrentOutputIndex(-1)
  }

  const handleClearInputHistory = () => {
    setInputTexts([])
    setCurrentInputIndex(-1)
  }

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
            inputText={currentInputText}
            onAction={handleAction}
          />

          <EditorArea
            inputText={currentInputText}
            outputText={currentOutputText}
            apiKey={apiKey}
            onInputChange={handleInputChange}
            onNavigateInput={handleNavigateInput}
            onNavigateOutput={handleNavigateOutput}
            onClearHistory={handleClearHistory}
            onClearInputHistory={handleClearInputHistory}
            canNavigatePrev={currentOutputIndex > 0}
            canNavigateNext={currentOutputIndex < outputTexts.length - 1}
            canInputNavigatePrev={currentInputIndex > 0}
            canInputNavigateNext={currentInputIndex < inputTexts.length - 1}
            outputCount={outputTexts.length}
            currentOutputIndex={currentOutputIndex}
            inputCount={inputTexts.length}
            currentInputIndex={currentInputIndex}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

