import { Globe } from 'lucide-react'
import type { Template } from './type'

const applyTemplate = (input: string, targetLanguage: string) => {
  return `Your task is to perform a translation:
Translate the following text to ${targetLanguage}:

${input}`
}

export const translate: Template = {
  type: 'group',
  title: 'Translate',
  Icon: Globe,
  applyTemplate,
  options: [
    { title: 'English', value: 'English' },
    { title: 'Arabic', value: 'Arabic' },
    { title: 'Chinese', value: 'Chinese' },
    { title: 'Dutch', value: 'Dutch' },
    { title: 'French', value: 'French' },
    { title: 'German', value: 'German' },
    { title: 'Italian', value: 'Italian' },
    { title: 'Japanese', value: 'Japanese' },
    { title: 'Korean', value: 'Korean' },
    { title: 'Portuguese', value: 'Portuguese' },
    { title: 'Russian', value: 'Russian' },
    { title: 'Spanish', value: 'Spanish' }
  ]
} 
