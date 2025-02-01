import { FunctionComponent } from "react"

export interface BaseTemplate {
  type: 'single' | 'group' // whether the button is a single button or a select
  Icon: FunctionComponent // the icon of the button
  title: string // the title of the button
}

export interface TemplateWithoutOptions extends BaseTemplate {
  type: 'single'
  applyTemplate: (input: string) => string
}

export interface TemplateWithOptions<T = string> extends BaseTemplate {
  type: 'group'
  applyTemplate: (input: string, optionValue: T) => string
  options: {
    title: string
    value: string
  }[]
}

export type Template = TemplateWithoutOptions | TemplateWithOptions
