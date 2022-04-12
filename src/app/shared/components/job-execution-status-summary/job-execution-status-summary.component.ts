import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JobExecutionStatusSummaries } from 'src/services/job-execution-status-summaries.model';
import { Job } from 'src/services/job.model';
import { WorkhorseService } from 'src/services/workhorse.service';
import { interval } from 'rxjs';
import { JobExecutionStatusSummary } from 'src/services/job-execution-status-summary.model';
@Component({
  selector: 'job-execution-status-summary',
  templateUrl: './job-execution-status-summary.component.html',
  styleUrls: ['./job-execution-status-summary.component.scss']
})
export class JobExecutionStatusSummaryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() status: string;
  @Input() workhorseStatusAutoRefresh: boolean;
  @Input() refreshInterval: number;

  lastMinutes: number;
  listMax = 8;
  currentlyStatusLoading = true;
  currentlyStatusAutoRefresh = false;
  imageSource: string;

  jobExecutionStatusSummaries: JobExecutionStatusSummaries;

  showSummaries: JobExecutionStatusSummary[];
  hideSummaries: JobExecutionStatusSummary[];
  hiddenJobs: number;
  hiddenExecutions: number;

  private currentlyStatusSubscription = null;

  constructor(private router: Router, private workhorseService: WorkhorseService) {}

  ngOnInit() {
    const statusToLowerCase = this.status.toLowerCase();
    this.imageSource = 'assets/horse_' + statusToLowerCase + '_xs.png';
    this.getJobByExecutionStatusSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleCurrentlyStatusAutoRefresh();
  }

  ngOnDestroy() {
    if (this.currentlyStatusSubscription) {
      this.currentlyStatusSubscription.unsubscribe();
    }
  }

  getJobByExecutionStatusSummary() {
    this.currentlyStatusLoading = true;
    this.workhorseService.getJobExecutionStatusSummaries(this.status, this.lastMinutes).subscribe((data: JobExecutionStatusSummaries) => {
      this.jobExecutionStatusSummaries = data;
      this.jobExecutionStatusSummaries.jobExecutionStatusSummaries.sort((a, b) => {
        return b.count - a.count;
      });
      this.showSummaries = this.jobExecutionStatusSummaries.jobExecutionStatusSummaries.splice(0, this.listMax);
      this.hideSummaries = this.jobExecutionStatusSummaries.jobExecutionStatusSummaries.splice(this.listMax);

      this.hiddenJobs = this.hideSummaries.length;
      this.hiddenExecutions = this.hideSummaries.reduce((x, current) => x + current.count, 0);

      this.currentlyStatusLoading = false;
    });
  }

  handleCurrentlyStatusAutoRefresh() {
    console.log('****** JOB: ', this.workhorseStatusAutoRefresh, this.refreshInterval);
    if (this.currentlyStatusSubscription) {
      this.currentlyStatusSubscription.unsubscribe();
    }
    if (this.workhorseStatusAutoRefresh && this.refreshInterval !== 0) {
      this.currentlyStatusSubscription = interval(this.refreshInterval).subscribe(() => {
        console.log('****** getJOBs by Interval: ', this.refreshInterval);
        this.getJobByExecutionStatusSummary();
      });
    }
    if (this.workhorseStatusAutoRefresh && this.refreshInterval === 0) {
        console.log('****** getJOBs immediately: ', this.refreshInterval);
        this.getJobByExecutionStatusSummary();
    }
  }

  showAll() {
    this.showSummaries = this.showSummaries.concat(this.hideSummaries);
    this.hideSummaries = [];
  }

  navigateToJob(job: Job) {
    this.router.navigate([`jobs/${job.id}`]);
  }
}
