import { level } from "./level.model"

export interface Scout {
  level: level
  match: number
  team: number
  [key: string]: any
}
