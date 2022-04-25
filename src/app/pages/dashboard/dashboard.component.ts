import { StatusService } from './../../../services/status.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobCounts } from 'src/services/job-counts.model';
import { JobStatusCount } from 'src/services/job-status-count.model';
import { Job } from 'src/services/job.model';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { JobService } from '../../../services/job.service';

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

  lastExecutionsViewEnabled = true;
  logsViewEnabled = true;
  jobsViewEnabled = true;
  threadsViewEnabled = true;

  private dashboardViewCookieName = 'wh-view-dashboard-v1';
  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private jobService: JobService,
    private cookieService: CookieService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService,
    public statusService: StatusService
  ) {}

  ngOnInit() {
    this.rebuildDashboardView();

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

  /* Saves current set flags of view in cookie */
  saveDashboardView() {
    const cookieValue = {
      lastExecutionsViewEnabled: this.lastExecutionsViewEnabled,
      logsViewEnabled: this.logsViewEnabled,
      jobsViewEnabled: this.jobsViewEnabled,
      threadsViewEnabled: this.threadsViewEnabled
    };
    this.cookieService.put(this.dashboardViewCookieName, JSON.stringify(cookieValue));
  }

  /* Rebuilds the view out of set flags of cookie */
  rebuildDashboardView() {
    const cookie = this.cookieService.get(this.dashboardViewCookieName);
    if (cookie) {
      const cookieValue = JSON.parse(cookie);
      this.lastExecutionsViewEnabled = cookieValue.lastExecutionsViewEnabled;
      this.logsViewEnabled = cookieValue.logsViewEnabled;
      this.jobsViewEnabled = cookieValue.jobsViewEnabled;
      this.threadsViewEnabled = cookieValue.threadsViewEnabled;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
