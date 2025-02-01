import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { models } from "@/store/settings"
import { Slider } from "@/components/ui/slider"

interface EditorSettingsProps {
  apiKey: string
  model: string
  temperature: number
  onApiKeyChange: (key: string) => void
  onModelChange: (model: string) => void
  onTemperatureChange: (temp: number) => void
}

export function EditorSettings({ apiKey, model, temperature, onApiKeyChange, onModelChange, onTemperatureChange }: EditorSettingsProps) {
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
      <div className="space-y-2">
        <label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
        <div className="relative">
          <Input
            id="apiKey"
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your API key..."
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Model</label>
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="temperature" className="text-sm font-medium">Temperature</label>
        <Slider
          value={[temperature]}
          onValueChange={(value) => onTemperatureChange(value[0])}
          min={0}
          max={1}
          step={0.01}
        />
        <div className="text-xs text-muted-foreground">Value: {temperature}</div>
      </div>
    </div>
  )
}

