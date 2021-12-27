import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "environments/environment"
import Secrets from "environments/secrets.json"
import { BackendService } from "./backend.service"
import { firstValueFrom } from "rxjs"
import { MatSnackBar } from "@angular/material/snack-bar"
import { order, stage } from "app/models/stage.model"

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

export type TBAEvents = TBAEvent[]

export interface TBASimpleMatch {
  key: string
  comp_level: stage
  match_number: number
  set_number: number
  event_key: string
  predicted_time: number
  alliances: {
    red: {
      team_keys: string[]
      surrogate_team_keys: string[]
      dq_team_keys: string[]
    }
    blue: {
      team_keys: string[]
      surrogate_team_keys: string[]
      dq_team_keys: string[]
    }
  }
  winning_alliance?: string
}

export interface TBARanking {
  team_key: string
  rank: number
}

@Injectable({
  providedIn: "root",
})
export class TheBlueAllianceService {
  QUARTERFINALS = [
    "1m1",
    "2m1",
    "3m1",
    "4m1",
    "1m2",
    "2m2",
    "3m2",
    "4m2",
    "1m3",
    "2m3",
    "3m3",
    "4m3",
  ]
  QUARTERFINALS_ORDER = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
  SEMIFINALS = ["1m1", "2m1", "1m2", "2m2", "1m3", "2m3"]
  SEMIFINALS_ORDER = [1, 2, 1, 2, 1, 2]
  FINALS = ["1m1", "1m2", "1m3"]
  FINALS_ORDER = [1, 1, 1]

  private setNumber(match: number, stage: string): number {
    if (stage === "qf") {
      return this.QUARTERFINALS_ORDER[match - 1]
    } else if (stage === "sf") {
      return this.SEMIFINALS_ORDER[match - 1]
    } else if (stage === "f") {
      return this.FINALS_ORDER[match - 1]
    } else {
      return match
    }
  }

  private headers = {
    "X-TBA-Auth-Key": Secrets.TBAKey,
  }

  private url = "https://www.thebluealliance.com/api/v3"
  private events: TBAEvents = []
  private matches: TBASimpleMatch[] = []
  private rankings: TBARanking[] = []

  constructor(
    private http: HttpClient,
    private backend: BackendService,
    private snack: MatSnackBar
  ) {
    this.events = JSON.parse(localStorage.getItem("Events") ?? "[]")
    this.matches = JSON.parse(localStorage.getItem("Matches") ?? "[]")
    this.rankings = JSON.parse(localStorage.getItem("Rankings") ?? "[]")

    const checkTBAKey = (reason: any) => {
      if (reason.error.Error.includes("X-TBA-Auth-Key")) {
        this.snack.open("Your TBA Read Key is Invalid", "Dismiss", {
          duration: 3000,
        })
      }
    }

    firstValueFrom(
      this.http.get<TBAEvents>(
        this.url + `/team/frc${environment.team}/events`,
        {
          headers: this.headers,
        }
      )
    )
      .then((events) => {
        this.events = events
        localStorage.setItem("Events", JSON.stringify(events))
      })
      .catch(checkTBAKey)

    firstValueFrom(
      this.http.get<TBASimpleMatch[]>(
        this.url + `/event/${this.backend.event}/matches/simple`,
        {
          headers: this.headers,
        }
      )
    )
      .then((matches) => {
        this.matches = matches.sort((a, b) => {
          if (a.comp_level === b.comp_level) {
            return a.match_number - b.match_number
          }
          return order.indexOf(a.comp_level) - order.indexOf(b.comp_level)
        })
        localStorage.setItem("Matches", JSON.stringify(this.matches))
      })
      .catch(checkTBAKey)

    firstValueFrom(
      this.http.get<{ rankings: TBARanking[] }>(
        this.url + `/event/${this.backend.event}/rankings`,
        {
          headers: this.headers,
        }
      )
    ).then((response) => {
      this.rankings = response.rankings
      localStorage.setItem("Rankings", JSON.stringify(this.rankings))
    })
  }

  getEvents(): TBAEvents {
    return this.events
  }

  getTeams(event: string, stage: string, game: number): number[][] {
    let match: TBASimpleMatch | undefined
    if (stage == "qm" || stage == "pr") {
      match = this.matches.find(
        (match) =>
          match.event_key === event &&
          match.comp_level === stage &&
          match.match_number === game
      )
    } else {
      const setNumber = this.setNumber(game, stage)
      match = this.matches.find(
        (match) =>
          match.event_key === event &&
          match.comp_level === stage &&
          match.set_number === setNumber
      )
    }
    if (match === undefined) {
      return []
    }

    return [match.alliances.red.team_keys, match.alliances.blue.team_keys].map(
      (teams) => teams.map((team) => Number(team.substring(3)))
    )
  }

  getRankings() {
    return this.rankings
  }

  getMatches() {
    return this.matches
  }

  removeFRCPrefix(team_key: string) {
    return Number(team_key.substring(3))
  }

  splitMatch(match: string): [stage, number] {
    console.log(match)
    if (match[0] === "p") {
      return ["pr", Number(match.substring(2))]
    } else if (match[0] === "f") {
      return ["f", this.FINALS.indexOf(match.substring(1)) + 1]
    } else if (match[0] === "s") {
      return ["sf", this.SEMIFINALS.indexOf(match.substring(2)) + 1]
    } else if (match[1] === "m") {
      return ["qm", Number(match.substring(2))]
    } else {
      return ["qf", this.QUARTERFINALS.indexOf(match.substring(2)) + 1]
    }
  }
}
