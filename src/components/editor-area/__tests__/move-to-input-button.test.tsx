import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MoveToInputButton } from "../move-to-input-button"
import { TooltipProvider } from "@/components/ui/tooltip"

describe("MoveToInputButton", () => {
  const renderComponent = (props: { disabled?: boolean; onClick?: () => void } = {}) => {
    const defaultProps = {
      disabled: false,
      onClick: vi.fn(),
      ...props,
    }

    return render(
      <TooltipProvider>
        <MoveToInputButton {...defaultProps} />
      </TooltipProvider>
    )
  }

  it("renders correctly", () => {
    renderComponent()
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("shows tooltip on hover", async () => {
    renderComponent()
    const button = screen.getByRole("button")
    
    // Trigger hover
    fireEvent.mouseEnter(button)
    fireEvent.focus(button)
    
    // Wait for the tooltip content
    await waitFor(() => {
      const tooltipContent = screen.getByRole("tooltip")
      expect(tooltipContent).toHaveTextContent("Move output to input")
    })
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    renderComponent({ onClick })
    const button = screen.getByRole("button")
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is disabled when disabled prop is true", () => {
    renderComponent({ disabled: true })
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })

  it("applies custom className correctly", () => {
    render(
      <TooltipProvider>
        <MoveToInputButton
          disabled={false}
          onClick={vi.fn()}
          className="custom-class"
        />
      </TooltipProvider>
    )
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-class")
  })
}) 