import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type React from "react" // Added import for React

interface Option {
  value: string
  title: string
}

interface ActionButtonWithSelectProps {
  options: Option[]
  storageKey: string
  buttonText: string
  icon: React.ReactNode
  isProcessing: boolean
  onAction: (selectedValue: string) => void
  disabled?: boolean
}

export function ActionButtonWithSelect({
  options,
  storageKey,
  buttonText,
  icon,
  isProcessing,
  onAction,
  disabled,
}: ActionButtonWithSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || options[0].value
    }
    return options[0].value
  })
  console.log('selectedValue', storageKey, selectedValue)

  useEffect(() => {
    localStorage.setItem(storageKey, selectedValue)
  }, [selectedValue, storageKey])

  return (
    <div className="inline-flex">
      <Select value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger className="w-[180px] border border-gray-300 rounded-l-md rounded-r-none"
          >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        onClick={() => onAction(selectedValue)} 
        disabled={disabled || isProcessing} 
        variant="secondary"
        className="rounded-r-md rounded-l-none border border-gray-300 border-l-0"
      >
        {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">{icon}</span>}
        {buttonText}
      </Button>
    </div>
  )
}

