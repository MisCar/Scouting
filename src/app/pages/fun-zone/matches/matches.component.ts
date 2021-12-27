import { BackendService } from "app/services/backend.service"
import { Component, OnInit } from "@angular/core"
import { environment } from "environments/environment"
import { HttpClient } from "@angular/common/http"
import Secrets from "environments/secrets.json"

@Component({
  selector: "app-matches",
  templateUrl: "./matches.component.html",
  styleUrls: ["./matches.component.scss"],
})
export class MatchesComponent implements OnInit {
  teamNumber: number = environment.team

  allMatches = JSON.parse(localStorage.getItem("Matches") ?? "")
  teamMatches: any[] = []

  private headers = {
    "X-TBA-Auth-Key": Secrets.TBAKey,
  }

  private url = "https://www.thebluealliance.com/api/v3"

  eventCode = this.backend.event
  rankings: any[] = []
  constructor(private backend: BackendService, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    for (let i = 0; i < (this.allMatches ?? []).length; i++) {
      let match = this.allMatches[i]
      let teams: string[] = []
      match.alliances.blue.team_keys.forEach((element: string) => {
        teams.push(element.replace("frc", ""))
      })
      match["blueTeams"] = teams.slice(0, 3)
      match.alliances.red.team_keys.forEach((element: string) => {
        teams.push(element.replace("frc", ""))
      })
      match["redTeams"] = teams.slice(3, 6)

      if (teams.includes(this.teamNumber.toString())) {
        this.teamMatches.push(match)
      }
    }

    await this.http
      .get(this.url + `/event/${this.eventCode}/rankings`, {
        headers: this.headers,
      })
      .forEach((rank) => this.rankings.push(rank))
    this.updateRankings()
  }

  getMatchName(match: any) {
    const key = match["key"]
    let matchName = key.split("_")[1] + ""
    if (matchName.startsWith("p")) {
      return "Practice " + matchName.replace("p", "")
    } else if (matchName.startsWith("qm")) {
      return "Qualifying Match " + matchName.replace("qm", "")
    } else if (matchName.startsWith("qf")) {
      return "Quarter Final " + matchName[2] + " Match " + matchName[4]
    } else if (matchName.startsWith("sf")) {
      return "Semi Final " + matchName[2] + " Match " + matchName[4]
    } else if (matchName.startsWith("f")) {
      return "Final " + matchName[1] + " Match " + matchName[3]
    }
    return key.split("_")[1]
  }

  getTeamRanking(teamNumber: number) {
    const rankings = JSON.parse(localStorage.getItem("Rankings") ?? "")
    console.log(rankings)

    for (let rank of rankings) {
      if (rank["teamNumber"] == teamNumber) {
        return rank["rank"]
      }
    }
    return 0
  }

  updateRankings() {
    let importantRakingData: { teamNumber: string; rank: string }[] = []
    this.rankings[0]["rankings"].forEach((element: { [x: string]: string }) => {
      importantRakingData.push({
        teamNumber: element["team_key"].replace("frc", ""),
        rank: element["rank"],
      })
    })
    localStorage.setItem("Rankings", JSON.stringify(importantRakingData))
  }
}
