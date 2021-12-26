import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ScoutOverviewComponent } from "./scout-overview.component"

describe("ScoutOverviewComponent", () => {
  let component: ScoutOverviewComponent
  let fixture: ComponentFixture<ScoutOverviewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScoutOverviewComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoutOverviewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
