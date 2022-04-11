import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutionTimelineComponent} from './execution-timeline.component';

describe('ExecutionTimelineComponent', () => {
  let component: ExecutionTimelineComponent;
  let fixture: ComponentFixture<ExecutionTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [ExecutionTimelineComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
