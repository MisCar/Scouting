import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunZoneHomeComponent } from './fun-zone-home.component';

describe('FunZoneHomeComponent', () => {
  let component: FunZoneHomeComponent;
  let fixture: ComponentFixture<FunZoneHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunZoneHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunZoneHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
