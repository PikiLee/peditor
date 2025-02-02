import { forwardRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Copy, ArrowLeft, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IEditorArea extends ComponentProps<"div"> {
  inputText: string
  outputText: string
  apiKey?: string
  onInputChange: (value: string) => void
  onNavigateOutput: (direction: 'prev' | 'next') => void
  onClearHistory: () => void
  canNavigatePrev: boolean
  canNavigateNext: boolean
  outputCount: number
  currentOutputIndex: number
}

export const EditorArea = forwardRef<HTMLDivElement, IEditorArea>(
  ({ 
    inputText, 
    outputText, 
    apiKey, 
    onInputChange, 
    onNavigateOutput,
    onClearHistory,
    canNavigatePrev,
    canNavigateNext,
    outputCount,
    currentOutputIndex,
    className, 
    ...props 
  }, ref) => {
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

    const handleMoveToInput = () => {
      if (outputText) {
        onInputChange(outputText)
        toast({
          description: "Output text moved to input",
          duration: 2000,
        })
      }
    }

    const handleClearHistory = () => {
      onClearHistory()
      toast({
        description: "Output history cleared",
        duration: 2000,
      })
    }

    return (
      <TooltipProvider>
        <div className="relative">
          <div ref={ref} className={cn("grid md:grid-cols-2 gap-4", className)} {...props}>
            {/* Input Column */}
            <div className="space-y-2 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Input</h2>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleCopy(inputText, "input")}
                      disabled={!inputText}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy input text</TooltipContent>
                </Tooltip>
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
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Output</h2>
                  {outputCount > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {currentOutputIndex + 1}/{outputCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 px-0"
                        onClick={() => onNavigateOutput('prev')}
                        disabled={!canNavigatePrev}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous output</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 px-0"
                        onClick={() => onNavigateOutput('next')}
                        disabled={!canNavigateNext}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next output</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleCopy(outputText, "output")}
                        disabled={!outputText}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy output text</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 px-0"
                        onClick={handleClearHistory}
                        disabled={outputCount === 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear history</TooltipContent>
                  </Tooltip>
                </div>
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

          {/* Move to Input Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-8 w-8"
                onClick={handleMoveToInput}
                disabled={!outputText}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move output to input</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    )
  }
)

EditorArea.displayName = "EditorArea" 