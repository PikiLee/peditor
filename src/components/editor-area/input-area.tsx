import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Copy, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { EditorToolbarButton } from "./editor-toolbar-button"

interface IInputArea {
  inputText: string
  onInputChange: (value: string) => void
  onCopy: (text: string, type: "input" | "output") => void
  onNavigateInput: (direction: 'prev' | 'next') => void
  onClearInputHistory: () => void
  canNavigatePrev: boolean
  canNavigateNext: boolean
  inputCount: number
  currentInputIndex: number
  className?: string
}

export const InputArea = forwardRef<HTMLDivElement, IInputArea & Omit<ComponentProps<"div">, keyof IInputArea>>(
  ({ 
    inputText, 
    onInputChange, 
    onCopy, 
    onNavigateInput,
    onClearInputHistory,
    canNavigatePrev,
    canNavigateNext,
    inputCount,
    currentInputIndex,
    className, 
    ...props 
  }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2 h-full", className)} {...props}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Input</h2>
            {inputCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {currentInputIndex + 1}/{inputCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <EditorToolbarButton
              tooltipContent="Previous input"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => onNavigateInput('prev')}
              disabled={!canNavigatePrev}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Next input"
              icon={<ChevronRight className="h-4 w-4" />}
              onClick={() => onNavigateInput('next')}
              disabled={!canNavigateNext}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Copy input text"
              icon={<Copy className="h-4 w-4" />}
              onClick={() => onCopy(inputText, "input")}
              disabled={!inputText}
            />
            <EditorToolbarButton
              tooltipContent="Clear history"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={onClearInputHistory}
              disabled={inputCount === 0}
              className="h-8 w-8 px-0"
            />
          </div>
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
    )
  }
)

InputArea.displayName = "InputArea" 