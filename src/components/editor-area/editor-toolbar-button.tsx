import { forwardRef } from "react"
import { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface IEditorToolbarButton extends ComponentProps<typeof Button> {
  tooltipContent: string
  icon: React.ReactNode
}

export const EditorToolbarButton = forwardRef<HTMLButtonElement, IEditorToolbarButton>(
  ({ tooltipContent, icon, className, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className={cn("h-8 px-2", className)}
            {...props}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    )
  }
)

EditorToolbarButton.displayName = "EditorToolbarButton" 