import { ComponentFixture, TestBed } from "@angular/core/testing"

import { TeamScoutsComponent } from "./team-scouts.component"

describe("TeamScoutsComponent", () => {
  let component: TeamScoutsComponent
  let fixture: ComponentFixture<TeamScoutsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeamScoutsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamScoutsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
