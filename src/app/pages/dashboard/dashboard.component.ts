import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobCounts } from 'src/services/job-counts.model';
import { JobStatusCount } from 'src/services/job-status-count.model';
import { Job } from 'src/services/job.model';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { JobService } from '../../../services/job.service';
import { WorkhorseCookieService } from '../../../services/workhorse-cookie.service';
import { StatusService } from './../../../services/status.service';

@Component({
  selector: 'app-workhorse',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  jobs: Array<Job> = [];

  currentlyQueued: Array<JobCounts>;
  jobStatusCount: JobStatusCount;

  queued: number[];
  finished: number[];
  failed: number[];
  strokeWidth = 1.0;
  queuedCount = 0;
  finishedCount = 0;
  failedCount = 0;

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private jobService: JobService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService,
    public workhorseCookieService: WorkhorseCookieService,
    public statusService: StatusService
  ) {}

  ngOnInit() {
    this.getJobStatusCount();

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getJobStatusCount();
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getJobStatusCount();
    });
  }

  getJobStatusCount() {
    this.jobService
      .getJobStatusCount()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: JobStatusCount) => {
        this.jobStatusCount = data;
      });
  }

  navigateToJob(job: Job) {
    this.router.navigate([`jobs/${job.id}`]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
