import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobExecutionStatusSummaries } from 'src/services/job-execution-status-summaries.model';
import { JobExecutionStatusSummary } from 'src/services/job-execution-status-summary.model';
import { Job } from 'src/services/job.model';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { WorkhorseService } from 'src/services/workhorse.service';
@Component({
  selector: 'job-execution-status-summary',
  templateUrl: './job-execution-status-summary.component.html',
  styleUrls: ['./job-execution-status-summary.component.scss']
})
export class JobExecutionStatusSummaryComponent implements OnInit, OnDestroy {
  @Input() status: string;

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

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private workhorseService: WorkhorseService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService
  ) {}

  ngOnInit() {
    const statusToLowerCase = this.status.toLowerCase();
    this.imageSource = 'assets/horse_' + statusToLowerCase + '_xs.png';

    this.getJobByExecutionStatusSummary();

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getJobByExecutionStatusSummary();
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getJobByExecutionStatusSummary();
    });
  }

  getJobByExecutionStatusSummary() {
    this.currentlyStatusLoading = true;
    this.workhorseService
      .getJobExecutionStatusSummaries(this.status, this.lastMinutes)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: JobExecutionStatusSummaries) => {
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

  showAll() {
    this.showSummaries = this.showSummaries.concat(this.hideSummaries);
    this.hideSummaries = [];
  }

  navigateToJob(job: Job) {
    this.router.navigate([`jobs/${job.id}`]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
