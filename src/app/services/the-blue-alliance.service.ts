import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { environment } from "environments/environment"
import Secrets from "environments/secrets.json"
import { BackendService } from "./backend.service"

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
  comp_level: string
  match_number: number
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
}

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
  private events: TBAEvents = []
  private matches: TBASimpleMatch[] = []

  constructor(private http: HttpClient, private backend: BackendService) {
    this.events = JSON.parse(localStorage.getItem("Events") ?? "[]")
    this.matches = JSON.parse(localStorage.getItem("Matches") ?? "[]")

    this.http
      .get<TBAEvents>(this.url + `/team/frc${environment.team}/events`, {
        headers: this.headers,
      })
      .toPromise()
      .then((events) => {
        this.events = events
        localStorage.setItem("Events", JSON.stringify(events))
      })

    this.http
      .get<TBASimpleMatch[]>(
        this.url + `/event/${this.backend.event}/matches/simple`,
        {
          headers: this.headers,
        }
      )
      .toPromise()
      .then((matches) => {
        this.matches = matches
        localStorage.setItem("Matches", JSON.stringify(matches))
      })
  }

  getEvents(): TBAEvents {
    return this.events
  }

  getTeams(event: string, stage: string, game: number): number[][] {
    const match = this.matches.find(
      (match) =>
        match.event_key === event &&
        match.comp_level === stage &&
        match.match_number === game
    )
    if (match === undefined) {
      console.log(event, stage, game)
      return []
    }

    return [match.alliances.red.team_keys, match.alliances.blue.team_keys].map(
      (teams) => teams.map((team) => Number(team.substring(3)))
    )
  }
}
