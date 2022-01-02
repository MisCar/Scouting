import { stage } from "./stage.model"

export interface Scout {
  level: stage
  match: number
  team: number
  [key: string]: any
}
