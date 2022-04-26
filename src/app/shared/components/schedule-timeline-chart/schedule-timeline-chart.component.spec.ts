import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTimelineChartComponent } from './schedule-timeline-chart.component';

describe('ScheduleTimelineChartComponent', () => {
  let component: ScheduleTimelineChartComponent;
  let fixture: ComponentFixture<ScheduleTimelineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleTimelineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTimelineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
