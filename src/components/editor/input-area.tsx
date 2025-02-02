import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { EditorToolbarButton } from "./editor-toolbar-button"

interface IInputArea {
  inputText: string
  onInputChange: (value: string) => void
  onCopy: (text: string, type: "input" | "output") => void
  className?: string
}

export const InputArea = forwardRef<HTMLDivElement, IInputArea & Omit<ComponentProps<"div">, keyof IInputArea>>(
  ({ inputText, onInputChange, onCopy, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2 h-full", className)} {...props}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Input</h2>
          <EditorToolbarButton
            tooltipContent="Copy input text"
            icon={<Copy className="h-4 w-4" />}
            onClick={() => onCopy(inputText, "input")}
            disabled={!inputText}
          />
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