import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleTimelineComponent } from './schedule-timeline.component';

describe('ScheduleTimelineComponent', () => {
  let component: ScheduleTimelineComponent;
  let fixture: ComponentFixture<ScheduleTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [ScheduleTimelineComponent] }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
