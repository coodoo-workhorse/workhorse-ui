import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'job-memory-chart',
  templateUrl: './job-memory-chart.component.html',
  styleUrls: ['./job-memory-chart.component.css']
})
export class JobMemoryChartComponent implements OnInit {
  @Input() data; // MemoryCountData

  queued: number[];
  finished: number[];
  failed: number[];
  strokeWidth = 1.0;
  queuedCount = 0;
  finishedCount = 0;
  failedCount = 0;

  ngOnInit() {
    this.queued = new Array();
    this.finished = new Array();
    this.failed = new Array();
    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        this.queued[i] = this.data[i].queued;
        this.finished[i] = this.data[i].finished;
        this.failed[i] = this.data[i].failed;
        this.queuedCount += this.queued[i];
        this.finishedCount += this.finished[i];
        this.failedCount += this.failed[i];
      }
    }
  }
}
