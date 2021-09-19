import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonComponent } from './simon.component';

describe('SimonComponent', () => {
  let component: SimonComponent;
  let fixture: ComponentFixture<SimonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
