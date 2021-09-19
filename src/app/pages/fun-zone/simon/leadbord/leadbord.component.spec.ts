import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadbordComponent } from './leadbord.component';

describe('LeadbordComponent', () => {
  let component: LeadbordComponent;
  let fixture: ComponentFixture<LeadbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadbordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
