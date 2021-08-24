export interface Widget {
  key: string
  label: string
  type: "Counter" | "Toggle" | "Timer"
}

export interface Section {
  prefix: string
  title: string
  subtitle?: string
  widgets: Widget[]
}

export default interface Schema {
  sections: Section[]
}
