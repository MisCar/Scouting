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
}
