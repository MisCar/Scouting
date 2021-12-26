import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Scout } from "app/models/scout.model"

@Component({
  selector: "app-team-scouts",
  templateUrl: "./team-scouts.component.html",
  styleUrls: ["./team-scouts.component.scss"],
})
export class TeamScoutsComponent implements OnInit {
  team?: number
  scouts: any[] = []

  constructor(route: ActivatedRoute) {
    route.queryParams.subscribe((params) => this.update(Number(params.number)))
  }

  ngOnInit(): void {}

  update(team: number) {
    this.team = team
    const scouts = JSON.parse(
      window.localStorage.getItem("Scouts") ?? "[]"
    ) as Scout[]
    this.scouts = scouts
      .filter((scout) => scout.team === team)
      .map((scout) => {
        const result: any = {
          Level: scout.level,
          Match: scout.match,
        }
        for (const category in scout) {
          if (
            category === "level" ||
            category === "match" ||
            category === "team"
          ) {
            continue
          }
          for (const key in scout[category]) {
            result[category + " " + key] = scout[category][key]
          }
        }
        return result
      })
  }

  get displayedColumns() {
    return Object.keys(this.scouts[0] ?? {})
  }
}
