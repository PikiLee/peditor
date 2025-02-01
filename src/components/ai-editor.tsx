import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { processText } from "../lib/api"
import { Loader2, AlertCircle } from "lucide-react"
import { EditorSettings } from "@/components/editor-settings"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { ActionButtonWithSelect } from "@/components/action-button-with-select"
import { templates } from "@/template"
import { useAtom } from "jotai"
import { inputTextAtom, outputTextAtom, modelAtom, apiKeyAtom } from "@/store/settings"
import { useState } from "react"
import { temperatureAtom } from "@/store/settings"

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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI Editor</h1>
            <ThemeToggle />
          </div>

          {/* Settings Section */}
          <EditorSettings
            apiKey={apiKey}
            model={model}
            temperature={temperature}
            onApiKeyChange={setApiKey}
            onModelChange={setModel}
            onTemperatureChange={setTemperature}
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {templates.map((template) => {
              if (template.type === 'group') {
                return (
                  <ActionButtonWithSelect
                    key={template.title}
                    options={[...template.options]}
                    storageKey={`select-${template.title}`}
                    buttonText={template.title}
                    icon={template.Icon ? <template.Icon /> : null}
                    isProcessing={isProcessing}
                    onAction={(value) => handleAction(template.applyTemplate(inputText, value))}
                    disabled={!inputText}
                  />
                )
              } else {
                return (
                  <Button
                    key={template.title}
                    onClick={() => handleAction(template.applyTemplate(inputText))}
                    disabled={!inputText || isProcessing}
                    variant="secondary"
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (template.Icon ? <template.Icon /> : null)}
                    {template.title}
                  </Button>
                )
              }
            })}
          </div>

          {/* Editor Area */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Input Column */}
            <div className="space-y-2 h-full">
              <h2 className="text-lg font-semibold">Input</h2>
              <div className="h-[calc(100%-2rem)]">
                <Textarea
                  placeholder="Enter your text here..."
                  className="h-full min-h-[400px] resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
            </div>

            {/* Output Column */}
            <div className="space-y-2 h-full">
              <h2 className="text-lg font-semibold">Output</h2>
              {!apiKey && (
                <Alert variant="default" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Please enter an API key to use the AI features.</AlertDescription>
                </Alert>
              )}
              <div className="h-[calc(100%-2rem)]">
                <Textarea
                  placeholder="AI generated text will appear here..."
                  className="h-full min-h-[400px] resize-none"
                  value={outputText}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

