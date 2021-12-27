import { Component, OnInit } from "@angular/core"
import { display } from "app/models/stage.model"
import {
  TBASimpleMatch,
  TheBlueAllianceService,
} from "app/services/the-blue-alliance.service"
import { environment } from "environments/environment"

@Component({
  selector: "app-matches",
  templateUrl: "./matches.component.html",
  styleUrls: ["./matches.component.scss"],
})
export class MatchesComponent implements OnInit {
  matches: any[] = []
  team = environment.team

  constructor(private tba: TheBlueAllianceService) {}

  async ngOnInit(): Promise<void> {
    this.matches = this.tba
      .getMatches()
      .filter(
        (match) =>
          match.alliances.red.team_keys.includes("frc" + this.team) ||
          match.alliances.blue.team_keys.includes("frc" + this.team)
      )
  }

  getMatchName(match: TBASimpleMatch) {
    const name = String(match.key.split("_")[1])
    const [stage, number] = this.tba.splitMatch(name)
    return display(stage) + " " + number
  }

  getTeamRanking(team_key: string) {
    for (let rank of this.tba.getRankings()) {
      if (rank.team_key === team_key) {
        return rank.rank
      }
    }
    console.error("Should not get here, couldn't find a rank for " + team_key)
    return 0
  }

  getTeamAlliance(match: TBASimpleMatch) {
    return match.alliances.red.team_keys.includes("frc" + this.team)
      ? "red"
      : "blue"
  }
}
