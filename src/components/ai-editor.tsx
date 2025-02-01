import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { processText } from "../../actions"
import { Loader2, Wand2, Reply, Languages, FileText, AlertCircle } from "lucide-react"
import { EditorSettings } from "@/components/editor-settings"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { ActionButtonWithSelect } from "@/components/action-button-with-select"
import { LANGUAGES, TONES } from "../../constants"

export default function AIEditor() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-4")

  async function handleAction(action: string, value?: string) {
    if (!inputText) return
    if (!apiKey) {
      setOutputText("Please enter an API key first.")
      return
    }

    setIsProcessing(true)
    try {
      const result = await processText(inputText, action, value)
      setOutputText(result)
    } catch (error) {
      console.error("Error processing text:", error)
      setOutputText("An error occurred while processing your request.")
    } finally {
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
          <EditorSettings apiKey={apiKey} model={model} onApiKeyChange={setApiKey} onModelChange={setModel} />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <ActionButtonWithSelect
              options={TONES}
              storageKey="selectedTone"
              buttonText="Change Tone"
              icon={<Wand2 className="h-4 w-4" />}
              isProcessing={isProcessing}
              onAction={(value) => handleAction("change-tone", value)}
              disabled={!inputText}
            />

            <ActionButtonWithSelect
              options={LANGUAGES}
              storageKey="selectedLanguage"
              buttonText="Translate"
              icon={<Languages className="h-4 w-4" />}
              isProcessing={isProcessing}
              onAction={(value) => handleAction("translate", value)}
              disabled={!inputText}
            />

            <Button
              onClick={() => handleAction("compose-reply")}
              disabled={!inputText || isProcessing}
              variant="secondary"
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Reply className="mr-2 h-4 w-4" />}
              Compose Reply
            </Button>

            <Button onClick={() => handleAction("summarize")} disabled={!inputText || isProcessing} variant="secondary">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Summarize
            </Button>
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
                <Alert variant="warning" className="mb-4">
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

