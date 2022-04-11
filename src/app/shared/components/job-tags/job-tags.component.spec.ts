import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JobTagsComponent} from './job-tags.component';

describe('JobTagsComponent', () => {
  let component: JobTagsComponent;
  let fixture: ComponentFixture<JobTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [JobTagsComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
