import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInfoComponent } from './schedule-info.component';

describe('ScheduleInfoComponent', () => {
  let component: ScheduleInfoComponent;
  let fixture: ComponentFixture<ScheduleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
