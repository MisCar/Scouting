import { ComponentFixture, TestBed } from "@angular/core/testing"

import { WidgetRowComponent } from "./widget-row.component"

describe("WidgetRowComponent", () => {
  let component: WidgetRowComponent
  let fixture: ComponentFixture<WidgetRowComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetRowComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetRowComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
