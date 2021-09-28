import { __values } from "tslib"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "environments/environment"
import Secrets from "environments/secrets.json"

export interface TBAEvent {
  address: string
  city: string
  country: string
  name: string
  end_date: string
  short_name: string
  key: string
  year: number
  playoff_type: number | null
}

export type Events = TBAEvent[]

@Injectable({
  providedIn: "root",
})
export class TheBlueAllianceService {
  QUARTERFINALS_ORDER = [
    "qf1m1",
    "qf2m1",
    "qf3m1",
    "qf4m1",
    "qf1m2",
    "qf2m2",
    "qf3m2",
    "qf4m2",
    "qf1m3",
    "qf2m3",
    "qf3m3",
    "qf4m3",
  ]

  SEMIFINALS_ORDER = ["sf1m1", "sf2m1", "sf1m2", "sf2m2", "sf1m3", "sf2m3"]

  FINALS_ORDER = ["f1m1", "f1m2", "f1m3"]
  private headers = {
    "X-TBA-Auth-Key": Secrets.TBAKey,
  }

  private url = "https://www.thebluealliance.com/api/v3"

  constructor(private http: HttpClient) {}

  getEvents(): Promise<Events> {
    return this.http
      .get<Events>(this.url + `/team/frc${environment.team}/events`, {
        headers: this.headers,
      })
      .toPromise()
  }

  async getTeams(
    event: string,
    stage: string,
    game: number
  ): Promise<string[]> {
    let code = event + "_"

    switch (stage) {
      case "pm":
      case "qm":
        code += stage + game
        break
      case "qf":
        code += this.QUARTERFINALS_ORDER[Number(game) - 1]
        break
      case "sf":
        code += this.SEMIFINALS_ORDER[Number(game) - 1]
        break
      case "f":
        code += this.FINALS_ORDER[Number(game) - 1]
        break
    }
    code = code.replace('"', "")

    const response: any = await this.http
      .get("https://www.thebluealliance.com/api/v3/match/" + code, {
        headers: this.headers,
      })
      .toPromise()

    const redTeams = response.alliances.red.team_keys.map((key: string) =>
      Number(key.substring(3))
    )
    let blueTeams = response.alliances.blue.team_keys.map((key: string) =>
      Number(key.substring(3))
    )
    const teams = redTeams + "," + blueTeams
    const teamsArray = teams.split(",")

    return teamsArray
  }
}
