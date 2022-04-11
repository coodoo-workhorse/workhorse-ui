import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ScheduleService } from '../../../../services/schedule.service';
import { ScheduleTimeline } from './schedule-timeline.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'schedule-timeline',
  templateUrl: './schedule-timeline.component.html',
  styleUrls: ['./schedule-timeline.component.css']
})
export class ScheduleTimelineComponent implements OnInit, OnChanges {
  @Input() schedule: string;
  @Input() parts: number;

  scheduleTimeline: Array<ScheduleTimeline> = [];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    if (!this.parts) {
      this.parts = 5;
    }
    this.getNextScheduledTimes(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.schedule.previousValue !== changes.schedule.currentValue) {
      this.getNextScheduledTimes(null);
    }
  }

  getNextScheduledTimes(add: boolean) {
    if (!this.schedule) {
      return;
    }
    if (add === true) {
      this.parts++;
    }
    if (add === false) {
      this.parts--;
    }
    this.scheduleService.getNextScheduledTimes(this.schedule, this.parts).subscribe(
      (data: Date[]) => {
        this.scheduleTimeline = [];
        let lastTime;
        for (const time of data) {
          const created = new ScheduleTimeline();
          created.time = time;
          if (lastTime) {
            created.duration = new Date(time).valueOf() - new Date(lastTime).valueOf();
          }
          lastTime = time;
          this.scheduleTimeline.push(created);
        }
      },
      () => {
        this.scheduleTimeline = null;
      }
    );
  }
}
