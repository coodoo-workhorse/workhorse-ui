import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { JobScheduleExecution } from 'src/services/job-schedule-execution.model';
import { ScheduleService } from '../../../services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  executionTimeline: GoogleChartInterface;
  loadingExecutionTimeline: boolean;
  scheduleHours: number;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.scheduleHours = 1;
    this.setExecutionScheduleTime(this.scheduleHours);
  }

  setExecutionScheduleTime(hours: any) {
    this.scheduleHours = hours;

    const today = new Date();
    const tomorrow = hours ? new Date(today.getTime() + 1000 * 60 * 60 * hours) : new Date(today.getTime() + 1000 * 60 * 60 * 1);

    this.getExecutionSchedules(today, tomorrow);
  }

  getExecutionSchedules(start: Date, end: Date) {
    this.loadingExecutionTimeline = true;

    this.scheduleService.getAllScheduledTimes(start, end).subscribe((jobDataSets: Array<JobScheduleExecution>) => {
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
}
