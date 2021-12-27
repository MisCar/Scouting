export type stage = "pr" | "qm" | "qf" | "sf" | "f"

export const display = (stage: stage) => {
  if (stage == "pr") {
    return "Practice"
  }
  if (stage == "qm") {
    return "Qualifications"
  }
  if (stage == "qf") {
    return "Quarterfinals"
  }
  if (stage == "sf") {
    return "Semifinals"
  }
  if (stage == "f") {
    return "Finals"
  }
  return ""
}

export const order = ["pr", "qm", "qf", "sf", "f"]
