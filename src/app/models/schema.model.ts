export interface WidgetInfo {
  key: string
  label: string
  type: "Counter" | "Toggle" | "Timer" | "Text"
  min?: number
  max?: number
  rows?: number
}

export interface Section {
  prefix: string
  title: string
  subtitle?: string
  widgets: WidgetInfo[]
}

export default interface Schema {
  sections: Section[]
}
