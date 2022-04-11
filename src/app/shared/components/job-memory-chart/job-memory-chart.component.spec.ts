
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobMemoryChartComponent} from './job-memory-chart.component';

describe('JobMemoryChartComponent', () => {
  let component: JobMemoryChartComponent;
  let fixture: ComponentFixture<JobMemoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [JobMemoryChartComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobMemoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
