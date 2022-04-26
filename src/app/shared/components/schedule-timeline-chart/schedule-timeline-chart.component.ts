import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobScheduleExecution } from 'src/services/job-schedule-execution.model';
import { RefreshIntervalService } from '../../../../services/refresh-interval.service';
import { RefreshService } from '../../../../services/refresh.service';
import { ScheduleService } from '../../../../services/schedule.service';

@Component({
  selector: 'schedule-timeline-chart',
  templateUrl: './schedule-timeline-chart.component.html',
  styleUrls: ['./schedule-timeline-chart.component.scss']
})
export class ScheduleTimelineChartComponent implements OnInit, OnDestroy {
  executionTimeline: GoogleChartInterface;
  loadingExecutionTimeline: boolean;
  scheduleHours: number;

  private unsubscribe = new Subject<void>();

  constructor(
    private scheduleService: ScheduleService,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService
  ) {}

  ngOnInit() {
    this.scheduleHours = 1;
    this.setExecutionScheduleTime(this.scheduleHours);

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.setExecutionScheduleTime(this.scheduleHours);
    });

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.setExecutionScheduleTime(this.scheduleHours);
    });
  }

  setExecutionScheduleTime(hours: any) {
    this.scheduleHours = hours;

    const today = new Date();
    const tomorrow = hours ? new Date(today.getTime() + 1000 * 60 * 60 * hours) : new Date(today.getTime() + 1000 * 60 * 60 * 1);

    this.getExecutionSchedules(today, tomorrow);
  }

  getExecutionSchedules(start: Date, end: Date) {
    this.loadingExecutionTimeline = true;

    this.scheduleService
      .getAllScheduledTimes(start, end)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((jobDataSets: Array<JobScheduleExecution>) => {
        const executionList = [];
        const lines = {};

        for (const jobData of jobDataSets) {
          for (const timestamp of jobData.executions) {
            const timestampStart = new Date(timestamp);
            if (!(timestampStart > end)) {
              lines[jobData.jobId + ''] = 'is drin';
              executionList.push({
                c: [
                  { v: jobData.jobName },
                  {
                    v: `<strong>${jobData.jobName}</strong><br>Scheduled:
                  ${timestampStart.toLocaleTimeString()}<br>Cron: ${jobData.schedule}`
                  },
                  { v: timestampStart },
                  { v: timestampStart }
                ]
              });
            }
          }
        }

        this.executionTimeline = {
          chartType: 'Timeline',
          dataTable: {
            cols: [
              { id: 'id', type: 'string' },
              { role: 'tooltip', type: 'string', p: { html: true } },
              { id: 'Start', type: 'date' },
              { id: 'End', type: 'date' }
            ],
            rows: executionList
          },
          options: {
            chartArea: { height: '90%', width: '90%' },
            hAxis: { format: 'HH:mm' },
            height: Object.keys(lines).length * 41 + 50,
            tooltip: 'isHtml'
          }
        };

        this.loadingExecutionTimeline = false;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
