import { Component, Input, OnChanges } from '@angular/core';
import { ExecutionTimeline } from './execution-timeline.model';

@Component({
  selector: 'job-execution-timeline',
  templateUrl: './execution-timeline.component.html',
  styleUrls: ['./execution-timeline.component.css']
})
export class ExecutionTimelineComponent implements OnChanges {
  timeline: Array<ExecutionTimeline> = [];

  @Input() status: string;
  @Input() startedAt: Date;
  @Input() endedAt: Date;
  @Input() plannedFor: Date;
  @Input() createdAt: Date;
  @Input() updatedAt: Date;
  @Input() embedded = false;

  ngOnChanges() {
    this.assembleTimeline();
  }

  private assembleTimeline() {
    this.timeline = [];

    const created = new ExecutionTimeline();
    created.state = 'QUEUED';
    created.label = 'Created';
    created.time = this.createdAt;
    this.timeline.push(created);

    if (this.plannedFor && this.createdAt !== this.plannedFor) {
      const plannedFor = new ExecutionTimeline();
      plannedFor.state = 'PLANNED';
      plannedFor.label = 'Planned';
      plannedFor.time = this.plannedFor;
      plannedFor.duration = this.calculateDuration(this.createdAt, this.plannedFor);
      this.timeline.push(plannedFor);
    }

    if (this.startedAt && !(this.plannedFor && this.plannedFor === this.startedAt)) {
      const started = new ExecutionTimeline();
      started.state = 'RUNNING';
      started.label = 'Started '; // + this.timeAgoPipe.transform(this.startedAt + '');
      started.time = this.startedAt;
      if (this.plannedFor) {
        started.duration = this.calculateDuration(this.plannedFor, this.startedAt);
      } else {
        started.duration = this.calculateDuration(this.createdAt, this.startedAt);
      }
      this.timeline.push(started);
    }

    if (this.endedAt && this.status === 'FINISHED') {
      const finished = new ExecutionTimeline();
      finished.state = 'FINISHED';
      finished.label = 'Finished';
      finished.time = this.endedAt;
      finished.duration = this.calculateDuration(this.startedAt, this.endedAt);
      this.timeline.push(finished);
    }
    if (this.endedAt && this.status === 'FAILED') {
      const failed = new ExecutionTimeline();
      failed.state = 'FAILED';
      failed.label = 'Failed';
      failed.time = this.endedAt;
      failed.duration = this.calculateDuration(this.startedAt, this.endedAt);
      this.timeline.push(failed);
    }
    if (this.status === 'ABORTED') {
      const aborted = new ExecutionTimeline();
      aborted.state = 'ABORTED';
      aborted.label = 'Aborted';
      aborted.time = this.updatedAt;
      if (this.startedAt) {
        aborted.duration = this.calculateDuration(this.startedAt, this.updatedAt);
      } else {
        aborted.duration = this.calculateDuration(this.createdAt, this.updatedAt);
      }
      this.timeline.push(aborted);
    }
  }

  private calculateDuration(from: Date, to: Date): number {
    const duration = new Date(to).valueOf() - new Date(from).valueOf();
    return duration;
  }
}
