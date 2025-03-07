import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { atomWithStorage } from 'jotai/utils'
export const apiKeyAtom = atomWithStorage<string>("apiKey", "")

export const modelAtom = atomWithStorage<OpenAIChatModelId>("model", "gpt-4o")

export const inputTextsAtom = atomWithStorage<string[]>("inputTexts", [])
export const currentInputIndexAtom = atomWithStorage<number>("currentInputIndex", -1)

export const outputTextsAtom = atomWithStorage<string[]>("outputTexts", [])
export const currentOutputIndexAtom = atomWithStorage<number>("currentOutputIndex", -1)

export const temperatureAtom = atomWithStorage<number>("temperature", 0.7)

export const models: { value: OpenAIChatModelId; label: string }[] = [
    {
      value: 'gpt-4o',
      label: 'GPT-4o',
    },
    {
      value: 'gpt-4o-mini',
      label: 'GPT-4o-mini',
    },
    {
      value: 'o1-mini',
      label: 'o1-mini',
    },
    {
      value: 'o1',
      label: 'o1',
    },
    {
      value: 'o3-mini',
      label: 'o3-mini',
    },
  ]