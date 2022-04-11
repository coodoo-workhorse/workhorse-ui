import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobExecutionStatusSummaryComponent } from './job-execution-status-summary.component';

describe('JobExecutionStatusSummaryComponent', () => {
  let component: JobExecutionStatusSummaryComponent;
  let fixture: ComponentFixture<JobExecutionStatusSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobExecutionStatusSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobExecutionStatusSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
