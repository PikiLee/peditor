import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, Copy, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EditorToolbarButton } from "./editor-toolbar-button"
import { useAtom } from "jotai"
import { apiKeyAtom, outputTextsAtom, currentOutputIndexAtom } from "@/store/settings"
import { mdRenderer } from "@/lib/md"

interface IOutputArea {
  onCopy: (text: string, type: "input" | "output") => void
  className?: string
}

export const OutputArea = forwardRef<HTMLDivElement, IOutputArea & Omit<ComponentProps<"div">, keyof IOutputArea>>(
  ({ onCopy, className, ...props }, ref) => {
    const [apiKey] = useAtom(apiKeyAtom)
    const [outputTexts, setOutputTexts] = useAtom(outputTextsAtom)
    const [currentOutputIndex, setCurrentOutputIndex] = useAtom(currentOutputIndexAtom)

    const outputText = currentOutputIndex >= 0 ? outputTexts[currentOutputIndex] : ""
    const outputCount = outputTexts.length
    const canNavigatePrev = currentOutputIndex > 0
    const canNavigateNext = currentOutputIndex < outputCount - 1

    const handleNavigateOutput = (direction: 'prev' | 'next') => {
      if (direction === 'prev' && canNavigatePrev) {
        setCurrentOutputIndex(currentOutputIndex - 1)
      } else if (direction === 'next' && canNavigateNext) {
        setCurrentOutputIndex(currentOutputIndex + 1)
      }
    }

    const handleClearHistory = () => {
      setOutputTexts([])
      setCurrentOutputIndex(-1)
    }

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
              onClick={() => handleNavigateOutput('prev')}
              disabled={!canNavigatePrev}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Next output"
              icon={<ChevronRight className="h-4 w-4" />}
              onClick={() => handleNavigateOutput('next')}
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
              onClick={handleClearHistory}
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
          <div className="h-full min-h-[400px] resize-none prose prose-md text-foreground [&>div>p:first-child]:mt-0 border rounded-md border-input bg-background p-3">
            <div dangerouslySetInnerHTML={{ __html: mdRenderer.render(outputText) }} />
          </div>
        </div>
      </div>
    )
  }
)

OutputArea.displayName = "OutputArea" 