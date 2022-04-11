import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { JobCounts } from 'src/services/job-counts.model';
import { JobStatusCount } from 'src/services/job-status-count.model';
import { Job } from 'src/services/job.model';
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

  refreshIntervall = 10000;
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

  workhorseStatusAutoRefresh = true;
  currentlyQueuedAutoRefresh = false;

  private workhorseStatusSubscription = null;
  private currentlyQueuedSubscription = null;

  private dashboardViewCookieName = 'wh-view-dashboard';

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private workhorseService: WorkhorseService,
    private jobService: JobService,
    private modalService: NgbModal,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.rebuildDashboardView();
    this.getWorkhorseStatus();
    this.handleAutoRefreshs();
    this.getJobStatusCount();
  }

  ngOnDestroy() {
    if (this.workhorseStatusSubscription) {
      this.workhorseStatusSubscription.unsubscribe();
    }
    if (this.currentlyQueuedSubscription) {
      this.currentlyQueuedSubscription.unsubscribe();
    }
  }

  getWorkhorseStatus() {
    this.workhorseService.getWorkhorseStatus().subscribe(
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
    this.jobService.getJobStatusCount().subscribe((data: JobStatusCount) => {
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
          this.workhorseService.startWorkhorse().subscribe(
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
          this.workhorseService.stopWorkhorse().subscribe(
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

  handleAutoRefreshs() {
    this.handleWorkhorseStatusAutoRefresh();
  }

  handleWorkhorseStatusAutoRefresh() {
    this.saveDashboardView();

    if (this.workhorseStatusAutoRefresh) {
      this.workhorseStatusSubscription = interval(this.refreshIntervall).subscribe(() => {
        if (this.workhorseStatus) {
          this.getWorkhorseStatus();
          this.getJobStatusCount();
        }
      });
    } else {
      if (this.workhorseStatusSubscription) {
        this.workhorseStatusSubscription.unsubscribe();
      }
    }
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
      threadsViewEnabled: this.threadsViewEnabled,
      currentlyQueuedAutoRefresh: this.currentlyQueuedAutoRefresh,
      workhorseStatusAutoRefresh: this.workhorseStatusAutoRefresh
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
      this.currentlyQueuedAutoRefresh = cookieValue.currentlyQueuedAutoRefresh;
      this.workhorseStatusAutoRefresh = cookieValue.workhorseStatusAutoRefresh;
    }
  }
}
