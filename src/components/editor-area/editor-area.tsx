import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { InputArea } from "./input-area"
import { OutputArea } from "./output-area"
import { MoveToInputButton } from "./move-to-input-button"
import { useAtom } from "jotai"
import { outputTextsAtom, currentOutputIndexAtom, inputTextsAtom, currentInputIndexAtom } from "@/store/settings"

export const EditorArea = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const [outputTexts] = useAtom(outputTextsAtom)
    const [currentOutputIndex] = useAtom(currentOutputIndexAtom)
    const [inputTexts, setInputTexts] = useAtom(inputTextsAtom)
    const [, setCurrentInputIndex] = useAtom(currentInputIndexAtom)
    const outputText = currentOutputIndex >= 0 ? outputTexts[currentOutputIndex] : ""

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
        const isDuplicate = inputTexts.includes(outputText)
        
        if (isDuplicate) {
          toast({
            description: "This text is already in your inputs",
            duration: 2000,
          })
          return
        }

        const newInputs = [...inputTexts, outputText]
        setInputTexts(newInputs)
        setCurrentInputIndex(newInputs.length - 1)
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
            <InputArea onCopy={handleCopy} />
            <OutputArea onCopy={handleCopy} />
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