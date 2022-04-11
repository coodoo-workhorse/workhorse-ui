
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExecutionCountPieChartComponent} from './execution-count-pie-chart.component';

describe('ExecutionCountPieChartComponent', () => {
  let component: ExecutionCountPieChartComponent;
  let fixture: ComponentFixture<ExecutionCountPieChartComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule(
            {declarations: [ExecutionCountPieChartComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionCountPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
