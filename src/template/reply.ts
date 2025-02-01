import type { Template } from './type'
import { MessageSquare } from 'lucide-react'

const applyTemplate = (input: string) => {
  return `Your task is to perform the following actions:
  1 - Find the paragraph delimited by <<<.
  2 - Compse a reply with the friendly tone.

  <<<${input}<<<
`
}

export const reply: Template = {
  type: 'single',
  title: 'Compose a reply',
  Icon: MessageSquare,
  applyTemplate,
}
