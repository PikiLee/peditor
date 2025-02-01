import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ActionButtonWithSelect } from "@/components/action-button-with-select"
import { templates } from "@/template"
import { ComponentProps, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface IEditorActions extends ComponentProps<"div"> {
  isProcessing: boolean
  inputText: string
  onAction: (text: string) => void
}

export const EditorActions = forwardRef<HTMLDivElement, IEditorActions>(
  ({ isProcessing, inputText, onAction, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-wrap gap-4", className)} {...props}>
        {templates.map((template) => {
          if (template.type === 'group') {
            return (
              <ActionButtonWithSelect
                key={template.title}
                options={[...template.options]}
                storageKey={`select-${template.title}`}
                buttonText={template.title}
                icon={template.Icon ? <template.Icon /> : null}
                isProcessing={isProcessing}
                onAction={(value) => onAction(template.applyTemplate(inputText, value))}
                disabled={!inputText}
              />
            )
          } else {
            return (
              <Button
                key={template.title}
                onClick={() => onAction(template.applyTemplate(inputText))}
                disabled={!inputText || isProcessing}
                variant="secondary"
              >
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (template.Icon ? <template.Icon /> : null)}
                {template.title}
              </Button>
            )
          }
        })}
      </div>
    )
  }
)

EditorActions.displayName = "EditorActions" 