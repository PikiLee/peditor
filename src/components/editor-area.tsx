import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Copy } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface IEditorArea extends ComponentProps<"div"> {
  inputText: string
  outputText: string
  apiKey?: string
  onInputChange: (value: string) => void
}

export const EditorArea = forwardRef<HTMLDivElement, IEditorArea>(
  ({ inputText, outputText, apiKey, onInputChange, className, ...props }, ref) => {
    const handleCopy = async (text: string, type: "input" | "output") => {
      try {
        await navigator.clipboard.writeText(text)
        toast({
          description: `${type === "input" ? "Input" : "Output"} text copied to clipboard`,
          duration: 2000,
        })
      } catch {
        toast({
          variant: "destructive",
          description: "Failed to copy text to clipboard",
          duration: 2000,
        })
      }
    }

    return (
      <div ref={ref} className={cn("grid md:grid-cols-2 gap-4", className)} {...props}>
        {/* Input Column */}
        <div className="space-y-2 h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Input</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleCopy(inputText, "input")}
              disabled={!inputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-2rem)]">
            <Textarea
              placeholder="Enter your text here..."
              className="h-full min-h-[400px] resize-none"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
            />
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-2 h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Output</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleCopy(outputText, "output")}
              disabled={!outputText}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
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
    )
  }
)

EditorArea.displayName = "EditorArea" 