import { forwardRef } from "react"
import { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface IMoveToInputButton extends ComponentProps<"button"> {
  disabled: boolean
  onClick: () => void
}

export const MoveToInputButton = forwardRef<HTMLButtonElement, IMoveToInputButton>(
  ({ disabled, onClick, className, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            size="icon"
            className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-8 w-8", className)}
            onClick={onClick}
            disabled={disabled}
            {...props}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Move output to input</TooltipContent>
      </Tooltip>
    )
  }
)

MoveToInputButton.displayName = "MoveToInputButton" 