import { Component, Input, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { ToastrService } from 'ngx-toastr';
import { ExecutionStatusCounts } from '../../../../services/execution-status-counts.model';
import { ExecutionService } from '../../../../services/execution.service';

@Component({
  selector: 'execution-count-pie-chart',
  templateUrl: './execution-count-pie-chart.component.html',
  styleUrls: ['./execution-count-pie-chart.component.css']
})
export class ExecutionCountPieChartComponent implements OnInit {
  @Input() jobId;

  loading: boolean;
  counts: ExecutionStatusCounts = null;
  minutes: number;
  timeunit: string;
  pieChart: GoogleChartInterface;

  constructor(private executionService: ExecutionService, private toastrService: ToastrService) {
    this.timeunit = 'day';
  }

  ngOnInit() {
    this.getCount();
  }

  getCount() {
    this.loading = true;
    let minutes: number;
    switch (this.timeunit) {
      case 'minute':
        minutes = 1;
        break;
      case 'hour':
        minutes = 60;
        break;
      case 'day':
        minutes = 1440;
        break;
      case 'week':
        minutes = 10080;
        break;
      case 'month':
        minutes = 43800;
        break;
      case 'all':
        minutes = 5256000; // 10 years
        break;
    }
    this.executionService.getStatusCounts(this.jobId, minutes).subscribe(
      (data: ExecutionStatusCounts) => {
        if (data) {
          this.counts = data;
          this.buildChart();
        } else {
          this.loading = false;
        }
      },
      (error: any) => {
        this.loading = false;
        this.toastrService.error(error.name, error.message);
      }
    );
  }

  buildChart() {
    const sum = this.counts.queued + this.counts.running + this.counts.finished + this.counts.failed + this.counts.aborted;

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: [
        ['Status', 'Count'],
        ['PLANNED', this.counts.planned],
        ['QUEUED', this.counts.queued],
        ['RUNNING', this.counts.running],
        ['FINISHED', this.counts.finished],
        ['FAILED', this.counts.failed],
        ['ABORTED', this.counts.aborted],
        ['NOTHING', sum === 0 ? 1 : 0]
      ],
      options: {
        legend: 'none',
        width: 200,
        height: 200,
        chartArea: { width: '90%', height: '90%' },
        backgroundColor: 'transparent',
        pieSliceText: sum === 0 ? 'none' : 'percentage',
        tooltip: { trigger: sum === 0 ? 'none' : 'focus' },
        colors: [
          '#4B0082', // Planned
          '#209dd7', // Queued
          '#faa31b', // Running
          '#5cb85c', // Finished
          '#d9534f', // Failed
          '#777777', // Aborted
          '#eeeeee' // Nothing to see here!
        ]
      }
    };
    this.loading = false;
  }
}
