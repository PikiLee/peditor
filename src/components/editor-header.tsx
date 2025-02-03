import { ComponentProps, forwardRef } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface IEditorHeader extends ComponentProps<"div"> {
  title?: string
}

export const EditorHeader = forwardRef<HTMLDivElement, IEditorHeader>(
  ({ title = "PEditor", className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("flex justify-between items-center", className)} 
        {...props}
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        <ThemeToggle />
      </div>
    )
  }
)

EditorHeader.displayName = "EditorHeader" 