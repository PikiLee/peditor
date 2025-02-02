import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Copy, ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { EditorToolbarButton } from "./editor-toolbar-button"
import { useAtom } from "jotai"
import { inputTextsAtom, currentInputIndexAtom } from "@/store/settings"

interface IInputArea {
  onCopy: (text: string, type: "input" | "output") => void
  className?: string
}

export const InputArea = forwardRef<HTMLDivElement, IInputArea & Omit<ComponentProps<"div">, keyof IInputArea>>(
  ({ onCopy, className, ...props }, ref) => {
    const [inputTexts, setInputTexts] = useAtom(inputTextsAtom)
    const [currentInputIndex, setCurrentInputIndex] = useAtom(currentInputIndexAtom)

    const inputText = currentInputIndex >= 0 ? inputTexts[currentInputIndex] : ""
    const inputCount = inputTexts.length
    const canNavigatePrev = currentInputIndex > 0
    const canNavigateNext = currentInputIndex < inputCount - 1

    const handleInputChange = (value: string) => {
      if (currentInputIndex === -1) {
        setInputTexts([...inputTexts, value])
        setCurrentInputIndex(inputTexts.length)
      } else {
        const newInputs = [...inputTexts]
        newInputs[currentInputIndex] = value
        setInputTexts(newInputs)
      }
    }

    const handleNavigateInput = (direction: 'prev' | 'next') => {
      if (direction === 'prev' && canNavigatePrev) {
        setCurrentInputIndex(currentInputIndex - 1)
      } else if (direction === 'next' && canNavigateNext) {
        setCurrentInputIndex(currentInputIndex + 1)
      }
    }

    const handleClearInputHistory = () => {
      setInputTexts([])
      setCurrentInputIndex(-1)
    }

    const handleNewInput = () => {
      const newInputs = [...inputTexts, ""]
      setInputTexts(newInputs)
      setCurrentInputIndex(newInputs.length - 1)
    }

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
              tooltipContent="New input"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleNewInput}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Previous input"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => handleNavigateInput('prev')}
              disabled={!canNavigatePrev}
              className="h-8 w-8 px-0"
            />
            <EditorToolbarButton
              tooltipContent="Next input"
              icon={<ChevronRight className="h-4 w-4" />}
              onClick={() => handleNavigateInput('next')}
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
              onClick={handleClearInputHistory}
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
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </div>
      </div>
    )
  }
)

InputArea.displayName = "InputArea" 