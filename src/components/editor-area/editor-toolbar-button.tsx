import { forwardRef } from "react"
import { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface IEditorToolbarButton extends ComponentProps<typeof Button> {
  tooltipContent: string
  icon: React.ReactNode
}

export const EditorToolbarButton = forwardRef<HTMLButtonElement, IEditorToolbarButton>(
  ({ tooltipContent, icon, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className="h-8 px-2"
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