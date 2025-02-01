import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface IEditorArea extends ComponentProps<"div"> {
  inputText: string
  outputText: string
  apiKey?: string
  onInputChange: (value: string) => void
}

export const EditorArea = forwardRef<HTMLDivElement, IEditorArea>(
  ({ inputText, outputText, apiKey, onInputChange, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("grid md:grid-cols-2 gap-4", className)} {...props}>
        {/* Input Column */}
        <div className="space-y-2 h-full">
          <h2 className="text-lg font-semibold">Input</h2>
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
    )
  }
)

EditorArea.displayName = "EditorArea" 