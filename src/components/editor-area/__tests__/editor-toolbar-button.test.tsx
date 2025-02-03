import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { EditorToolbarButton } from "../editor-toolbar-button"
import { TooltipProvider } from "@/components/ui/tooltip"

describe("EditorToolbarButton", () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>
  const tooltipContent = "Test Tooltip"

  const renderComponent = (props: Partial<React.ComponentProps<typeof EditorToolbarButton>> = {}) => {
    const defaultProps = {
      tooltipContent,
      icon: mockIcon,
      ...props,
    }

    return render(
      <TooltipProvider>
        <EditorToolbarButton {...defaultProps} />
      </TooltipProvider>
    )
  }

  it("renders correctly with icon", () => {
    renderComponent()
    expect(screen.getByRole("button")).toBeInTheDocument()
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument()
  })

  it("shows tooltip on hover", async () => {
    renderComponent()
    const button = screen.getByRole("button")
    
    // Trigger hover
    fireEvent.mouseEnter(button)
    fireEvent.focus(button)
    
    // Get tooltip by role instead of text to be more specific
    const tooltip = screen.getByRole("tooltip", { name: tooltipContent })
    expect(tooltip).toBeInTheDocument()
  })

  it("applies custom className correctly", () => {
    renderComponent({ className: "custom-class" })
    const button = screen.getByRole("button")
    
    // Should have base button classes
    expect(button).toHaveClass("inline-flex", "items-center", "justify-center")
    
    // Should have our custom size classes (these override the default sm size classes)
    expect(button).toHaveClass("h-8", "px-2")
    
    // Should have the passed custom class
    expect(button).toHaveClass("custom-class")
  })

  it("applies ghost variant by default", () => {
    renderComponent()
    const button = screen.getByRole("button")
    expect(button).toHaveClass("hover:bg-accent")
    expect(button).toHaveClass("hover:text-accent-foreground")
  })

  it("can override button variant", () => {
    renderComponent({ variant: "default" })
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-primary")
    expect(button).toHaveClass("text-primary-foreground")
    expect(button).toHaveClass("hover:bg-primary/90")
  })

  it("is disabled when disabled prop is true", () => {
    renderComponent({ disabled: true })
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
    expect(button).toHaveClass("disabled:pointer-events-none")
    expect(button).toHaveClass("disabled:opacity-50")
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    renderComponent({ onClick })
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
}) 