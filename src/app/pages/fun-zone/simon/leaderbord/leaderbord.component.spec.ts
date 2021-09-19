import { ComponentFixture, TestBed } from "@angular/core/testing"

import { LeaderbordComponent } from "./leaderbord.component"

describe("leaderbordComponent", () => {
  let component: LeaderbordComponent
  let fixture: ComponentFixture<LeaderbordComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaderbordComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderbordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
