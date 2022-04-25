import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { JobCounts } from 'src/services/job-counts.model';
import { JobStatusCount } from 'src/services/job-status-count.model';
import { Job } from 'src/services/job.model';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { WorkhorseService } from 'src/services/workhorse.service';
import { JobService } from '../../../services/job.service';

@Component({
  selector: 'app-workhorse',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  initialLoading = true;

  workhorseStatus: boolean;

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
    private toastrService: ToastrService,
    private workhorseService: WorkhorseService,
    private jobService: JobService,
    private modalService: NgbModal,
    private cookieService: CookieService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService
  ) {}

  ngOnInit() {
    this.rebuildDashboardView();

    this.getWorkhorseStatus();
    this.getJobStatusCount();

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getWorkhorseStatus();
      this.getJobStatusCount();
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getWorkhorseStatus();
      this.getJobStatusCount();
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getWorkhorseStatus() {
    this.workhorseService
      .getWorkhorseStatus()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (data: boolean) => {
          if (this.initialLoading) {
            this.initialLoading = false;
            this.loading = false;
          }
          this.workhorseStatus = data;
        },
        (error: any) => {
          this.toastrService.info('Auto updated failed' + error.message);
        }
      );
  }

  getJobStatusCount() {
    this.jobService
      .getJobStatusCount()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: JobStatusCount) => {
        this.jobStatusCount = data;
      });
  }

  startWorkhorse() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = 'Are you sure you want to start Workhorse';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.loading = true;
          this.workhorseService
            .startWorkhorse()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              () => {
                this.toastrService.success('Workhorse started');
                this.workhorseStatus = true;
                this.getJobStatusCount();
                this.loading = false;
              },
              (error: any) => {
                this.toastrService.error('Could not start Workhorse: ' + error.message);
                this.loading = false;
              }
            );
        }
      },
      () => {}
    );
  }

  stopWorkhorse() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = 'Are you sure you want to stop Workhorse';

    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.loading = true;
          this.workhorseService
            .stopWorkhorse()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              () => {
                this.toastrService.success('Workhorse stopped');
                this.workhorseStatus = false;
                this.loading = false;
              },
              (error: any) => {
                this.toastrService.error('Could not stop Workhorse: ' + error.message);
                this.loading = false;
              }
            );
        }
      },
      () => {}
    );
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
}
