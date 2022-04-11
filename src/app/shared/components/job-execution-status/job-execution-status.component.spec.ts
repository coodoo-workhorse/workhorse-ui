import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobExecutionStatusComponent } from './job-execution-status.component';

describe('JobExecutionStatusComponent', () => {
  let component: JobExecutionStatusComponent;
  let fixture: ComponentFixture<JobExecutionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [JobExecutionStatusComponent] }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobExecutionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
