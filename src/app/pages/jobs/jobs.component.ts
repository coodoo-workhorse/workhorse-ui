import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CooTableListingService, CooTableSelectionService, ListingResult, Metadata } from '@coodoo/coo-table';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job } from 'src/services/job.model';
import { WorkhorseCookieService } from 'src/services/workhorse-cookie.service';
import { JobService } from '../../../services/job.service';
import { RefreshIntervalService } from '../../../services/refresh-interval.service';
import { RefreshService } from '../../../services/refresh.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CreateExecutionComponent } from '../executions/create-execution/create-execution.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  providers: [CooTableListingService, CooTableSelectionService]
})
export class JobsComponent implements OnInit, OnDestroy {
  rows: Array<Job> = [];
  metadata: Metadata;

  activeJobs = 0;
  inactiveJobs = 0;
  loading = true;
  subs = null;
  status: Array<string> = ['ACTIVE', 'INACTIVE', 'ERROR', 'NO_WORKER'];

  rowSelectionEnabled = false;
  selectedRows = [];

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private jobService: JobService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private cooTableListingService: CooTableListingService,
    private cooTableSelectionService: CooTableSelectionService,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService,
    private workhorseCookieService: WorkhorseCookieService
  ) {
    this.cooTableSelectionService.selectedRowsChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(selectedRows => {
      this.selectedRows = selectedRows;
    });
  }

  ngOnInit() {
    this.cooTableListingService.setMetadata({
      limit: this.workhorseCookieService.getWorkhorseCookie().jobsListingLimit,
      sort: this.workhorseCookieService.getWorkhorseCookie().jobsListingSort
    } as Metadata);

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.cooTableListingService.list$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.cooTableListingService.metadata$.pipe(takeUntil(this.unsubscribe)).subscribe((metadata) => {
      this.workhorseCookieService.setCookieValue('jobsListingLimit', metadata.limit);
      this.workhorseCookieService.setCookieValue('jobsListingSort', metadata.sort);
    });
  }

  list() {
    this.loading = true;
    this.rows = [];
    this.jobService.getJobs(this.cooTableListingService.getListingParameters()).pipe(takeUntil(this.unsubscribe)).subscribe((listingResult: ListingResult<Job>) => {
      this.rows = listingResult.results;
      this.metadata = listingResult.metadata;

      this.activeJobs = 0;
      this.inactiveJobs = 0;
      for (const row of this.rows) {
        if (row.status === 'ACTIVE') {
          this.activeJobs++;
        } else {
          this.inactiveJobs++;
        }
      }
      this.loading = false;
    });
  }

  toggleSelectedJobsStatus(deactivate: boolean) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content =
      'Do you really want to ' + (deactivate ? 'deactivate' : 'activate') + ' all ' + this.selectedRows.length + ' selected jobs?';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          for (const row of this.selectedRows) {
            if (deactivate) {
              this.jobService.deactivateJob(row.id).subscribe(
                (job: Job) => {
                  row.status = job.status;
                  this.toastrService.success(`Deactivated job <strong>${row.name}</strong>`);
                },
                () => {
                  this.toastrService.error(`Could not deactivate job <strong>${row.name}</strong>`);
                }
              );
            } else {
              this.jobService.activateJob(row.id).pipe(takeUntil(this.unsubscribe)).subscribe(
                (job: Job) => {
                  row.status = job.status;
                  this.toastrService.success(`Activated job <strong>${row.name}</strong>`);
                },
                () => {
                  this.toastrService.error(`Could not activate job <strong>${row.name}</strong>`);
                }
              );
            }
          }
          this.cooTableSelectionService.unselectAll();
          this.list();
        }
      },
      () => { }
    );
  }

  activateJob(row: Job) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content = 'Do you really want to activate job <strong>' + row.name + '</strong>?';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.jobService.activateJob(row.id).pipe(takeUntil(this.unsubscribe)).subscribe(
            (job: Job) => {
              row.status = job.status;
              this.toastrService.success(`Activated job <strong>${row.name}</strong>`);
              this.list();
            },
            () => {
              this.toastrService.error(`Could not activate job <strong>${row.name}</strong>`);
            }
          );
        }
      },
      () => { }
    );
  }

  deactivateJob(row: Job) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content = 'Do you really want to deactivate job <strong>' + row.name + '</strong>?';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.jobService.deactivateJob(row.id).pipe(takeUntil(this.unsubscribe)).subscribe(
            (job: Job) => {
              row.status = job.status;
              this.toastrService.success(`Deactivated job <strong>${row.name}</strong>`);
              this.list();
            },
            () => {
              this.toastrService.error(`Could not deactivate job <strong>${row.name}</strong>`);
            }
          );
        }
      },
      () => { }
    );
  }

  createExecution(job: Job) {
    const modalRef: NgbModalRef = this.modalService.open(CreateExecutionComponent, { size: 'lg' });
    modalRef.componentInstance.job = job;
    modalRef.result
      .then(() => {
        this.list();
      })
      .catch(() => { });
  }

  showJob(job: Job) {
    this.router.navigate([`jobs/${job.id}`]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
