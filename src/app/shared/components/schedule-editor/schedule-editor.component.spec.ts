import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleEditorComponent } from './schedule-editor.component';

describe('ScheduleEditorComponent', () => {
  let component: ScheduleEditorComponent;
  let fixture: ComponentFixture<ScheduleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [ScheduleEditorComponent] }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
