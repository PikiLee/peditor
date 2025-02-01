import React from "react"
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
import useSWRMutation from 'swr/mutation'

export default function AIEditor() {
  const [inputText, setInputText] = useAtom(inputTextAtom)
  const [outputText, setOutputText] = useAtom(outputTextAtom)
  const [apiKey, setApiKey] = useAtom(apiKeyAtom)
  const [model, setModel] = useAtom(modelAtom)

  const { trigger, isMutating } = useSWRMutation('process-text', (key, { arg }: { arg: [string, string, string] }) => {
    const [inputTextParam, apiKeyParam, modelParam] = arg;
    return processText(inputTextParam, apiKeyParam, modelParam);
  });

  async function handleAction(inputTextParam?: string) {
    const text = inputTextParam || inputText;
    if (!text) return;
    if (!apiKey) {
      setOutputText("Please enter an API key first.");
      return;
    }

    try {
      const result = await trigger([text, apiKey, model]);
      setOutputText(result);
    } catch (error) {
      console.error("Error processing text:", error);
      setOutputText("An error occurred while processing your request.");
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
            {templates.map((template) => {
              if (template.type === 'group') {
                return (
                  <ActionButtonWithSelect
                    key={template.title}
                    options={[...template.options]}
                    storageKey={`selected-${template.title}`}
                    buttonText={template.title}
                    icon={template.Icon ? <template.Icon /> : null}
                    isProcessing={isMutating}
                    onAction={(value) => handleAction(template.applyTemplate(inputText, value))}
                    disabled={!inputText}
                  />
                )
              } else {
                return (
                  <Button
                    key={template.title}
                    onClick={() => handleAction(template.applyTemplate(inputText))}
                    disabled={!inputText || isMutating}
                    variant="secondary"
                  >
                    {isMutating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (template.Icon ? <template.Icon /> : null)}
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

