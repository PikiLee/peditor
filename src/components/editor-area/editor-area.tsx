import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { InputArea } from "./input-area"
import { OutputArea } from "./output-area"
import { MoveToInputButton } from "./move-to-input-button"

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

    return (
      <TooltipProvider>
        <div className="relative">
          <div ref={ref} className={cn("grid md:grid-cols-2 gap-4", className)} {...props}>
            <InputArea
              inputText={inputText}
              onInputChange={onInputChange}
              onCopy={handleCopy}
            />
            <OutputArea
              outputText={outputText}
              apiKey={apiKey}
              onCopy={handleCopy}
              onNavigateOutput={onNavigateOutput}
              onClearHistory={onClearHistory}
              canNavigatePrev={canNavigatePrev}
              canNavigateNext={canNavigateNext}
              outputCount={outputCount}
              currentOutputIndex={currentOutputIndex}
            />
          </div>
          <MoveToInputButton
            onClick={handleMoveToInput}
            disabled={!outputText}
          />
        </div>
      </TooltipProvider>
    )
  }
)

EditorArea.displayName = "EditorArea" 