import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Copy, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EditorToolbarButton } from "./editor-toolbar-button"

interface IOutputArea {
  outputText: string
  apiKey?: string
  onCopy: (text: string, type: "input" | "output") => void
  onNavigateOutput: (direction: 'prev' | 'next') => void
  onClearHistory: () => void
  canNavigatePrev: boolean
  canNavigateNext: boolean
  outputCount: number
  currentOutputIndex: number
  className?: string
}

export const OutputArea = forwardRef<HTMLDivElement, IOutputArea & Omit<ComponentProps<"div">, keyof IOutputArea>>(
  ({ 
    outputText, 
    apiKey,
    onCopy,
    onNavigateOutput,
    onClearHistory,
    canNavigatePrev,
    canNavigateNext,
    outputCount,
    currentOutputIndex,
    className,
    ...props 
  }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2 h-full", className)} {...props}>
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
            <EditorToolbarButton
              tooltipContent="Previous output"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => onNavigateOutput('prev')}
              disabled={!canNavigatePrev}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Next output"
              icon={<ChevronRight className="h-4 w-4" />}
              onClick={() => onNavigateOutput('next')}
              disabled={!canNavigateNext}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Copy output text"
              icon={<Copy className="h-4 w-4" />}
              onClick={() => onCopy(outputText, "output")}
              disabled={!outputText}
            />
            <EditorToolbarButton
              tooltipContent="Clear history"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={onClearHistory}
              disabled={outputCount === 0}
              className="h-8 w-8 px-0"
            />
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
    )
  }
)

OutputArea.displayName = "OutputArea" 