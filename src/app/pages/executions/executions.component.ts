import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CooTableListingService, CooTableSelectionService, ListingResult, Metadata } from '@coodoo/coo-table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Execution } from 'src/services/execution.model';
import { Job } from 'src/services/job.model';
import { WorkhorseCookieService } from 'src/services/workhorse-cookie.service';
import { ExecutionService } from '../../../services/execution.service';
import { JobStore } from '../../../services/job.store';
import { RefreshIntervalService } from '../../../services/refresh-interval.service';
import { RefreshService } from '../../../services/refresh.service';
import { CreateExecutionComponent } from './create-execution/create-execution.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'executions',
  templateUrl: './executions.component.html',
  styleUrls: ['./executions.component.css'],
  providers: [CooTableListingService, CooTableSelectionService]
})
export class ExecutionsComponent implements OnInit, OnDestroy {
  @Input() embedded = false;
  @Input() batchId: number;
  @Input() chainId: number;
  @Input() hideParameters: boolean;

  jobId: number;
  rows: Array<Execution> = [];
  metadata: Metadata;

  executionsOpen = 0;
  executionsDone = 0;

  job: Job;

  loading = false;
  status: Array<string> = ['PLANNED', 'QUEUED', 'RUNNING', 'FINISHED', 'FAILED', 'ABORTED'];

  rowSelectionEnabled = false;
  selectedRows = [];

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobStore: JobStore,
    private executionService: ExecutionService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private cooTableListingService: CooTableListingService,
    private cooTableSelectionService: CooTableSelectionService,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService,
    private workhorseCookieService: WorkhorseCookieService
  ) {
    this.loading = true;

    this.cooTableSelectionService.selectedRowsChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(selectedRows => {
      this.selectedRows = selectedRows;
    });
  }

  ngOnInit() {
    this.cooTableListingService.setMetadata({
      limit: this.workhorseCookieService.getWorkhorseCookie().executionsListingLimit,
      sort: this.workhorseCookieService.getWorkhorseCookie().executionsListingSort
    } as Metadata);

    if (this.batchId) {
      this.cooTableListingService.filterTable({
        column: 'batchId',
        value: this.batchId
      });
    }
    if (this.chainId) {
      this.cooTableListingService.filterTable({
        column: 'chainId',
        value: this.chainId
      });
    }

    this.jobId = this.route.snapshot.params.jobId;

    if (this.jobId && !this.embedded) {
      this.jobStore.jobs$.subscribe(jobs => {
        this.job = this.jobStore.getJob(+this.jobId);
      });
    }

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.cooTableListingService.list$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.cooTableListingService.metadata$.pipe(takeUntil(this.unsubscribe)).subscribe(metadata => {
      this.workhorseCookieService.setCookieValue('executionsListingLimit', metadata.limit);
      this.workhorseCookieService.setCookieValue('executionsListingSort', metadata.sort);
    });
  }

  list() {
    this.loading = true;
    this.rows = [];

    this.executionService
      .getJobExecutions(this.cooTableListingService.getListingParameters(), this.jobId ? this.jobId : 0)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((listingResult: ListingResult<Execution>) => {
        this.rows = listingResult.results;
        this.metadata = listingResult.metadata;

        this.executionsOpen = 0;
        this.executionsDone = 0;
        for (const row of this.rows) {
          if (this.isOpen(row)) {
            this.executionsOpen++; // Abort execution
          } else {
            this.executionsDone++; // Redo execution / Delete execution
          }
        }
        const filterStatus = this.cooTableListingService.getListingParameters().attributeFilters.get('status');
        this.loading = false;
      });
  }

  isOpen(row: Execution) {
    return row.status === 'PLANNED' || row.status === 'QUEUED' || row.status === 'RUNNING';
  }

  onTableChanged() {}

  showJob(execution: Execution) {
    this.router.navigate([`jobs/${execution.jobId}`]);
  }

  showExecution(execution: Execution) {
    this.router.navigate([`jobs/${execution.jobId}/executions/${execution.id}`]);
  }

  showRetryExecution(execution: Execution) {
    this.router.navigate([`jobs/${execution.jobId}/executions/${execution.failRetryExecutionId}`]);
  }

  jsonParameters(execution: Execution): any {
    if (execution.parameters) {
      return execution.parameters.replace(/\{|\}/g, '').replace(/"/g, '').replace(/,/g, ', ');
    }
    return null;
  }

  createExecution(execution: Execution) {
    const modalRef: NgbModalRef = this.modalService.open(CreateExecutionComponent, { size: 'md' });
    modalRef.componentInstance.job = this.job;
    modalRef.componentInstance.execution = execution;
    modalRef.result
      .then(() => {
        this.list();
      })
      .catch(() => {});
  }

  abortSelectedExecutions() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content = 'Do you really want to abort all ' + this.selectedRows.length + ' selected job execution?';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          for (const row of this.selectedRows) {
            this.abortExecution(row);
          }
          this.cooTableSelectionService.unselectAll();
          this.list();
        }
      },
      () => {}
    );
  }

  abortExecution(row: Execution) {
    const execution: Execution = new Execution();
    execution.id = row.id;
    execution.jobId = row.jobId;
    execution.status = 'ABORTED';
    execution.parameters = row.parameters;
    execution.priority = row.priority;
    execution.plannedFor = row.plannedFor;

    const oldStatus = row.status;
    const oldUpdatedAt = row.updatedAt;
    row.status = 'ABORTED';
    row.updatedAt = new Date();

    this.executionService
      .updateJobExecution(row.jobId, execution)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (updatedExecution: Execution) => {
          this.toastrService.success('Job execution with ID ' + row.id + ' aborted');
          // hoffen, dass es klappt...
        },
        error => {
          row.status = oldStatus;
          row.updatedAt = oldUpdatedAt;
          this.toastrService.error('Could not abort job execution with ID ' + row.id + ': ' + error.message);
        }
      );
  }

  redoSelectedExecutions() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content =
      'Do you really want to redo all ' +
      this.selectedRows.length +
      ' selected job execution?<br> All metadata like timestamps and logs of this execution will be gone!';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          for (const row of this.selectedRows) {
            this.executionService
              .redoJobExecution(row.jobId, row.id)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                () => {
                  this.toastrService.success('Redo job execution with ID ' + row.id);
                },
                error => {
                  this.toastrService.error('Could not redo job execution with ID ' + row.id + ': ' + error.message);
                }
              );
          }
          this.cooTableSelectionService.unselectAll();
          this.list();
        }
      },
      () => {}
    );
  }

  redoExecution(row: Execution) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content =
      'Do you really want to redo job execution with ID ' +
      row.id +
      '?<br> All metadata like timestamps and logs of this execution will be gone!';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.executionService
            .redoJobExecution(row.jobId, row.id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              () => {
                this.toastrService.success('Redo job execution with ID ' + row.id);
                this.list();
              },
              error => {
                this.toastrService.error('Could not redo job execution with ID ' + row.id + ': ' + error.message);
              }
            );
        }
      },
      () => {}
    );
  }

  deleteSelectedExecutions() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    // tslint:disable-next-line: max-line-length
    modalRef.componentInstance.content = 'Do you really want to delete all ' + this.selectedRows.length + ' selected job execution?';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          for (const row of this.selectedRows) {
            this.executionService
              .deleteJobExecution(row.jobId, row.id)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                () => {
                  this.toastrService.success('Job execution with ID ' + row.id + ' deleted');
                },
                error => {
                  this.toastrService.error('Could not delete job execution with ID ' + row.id + ': ' + error.message);
                }
              );
            this.cooTableSelectionService.unselectAll();
            this.list();
          }
        }
      },
      () => {}
    );
  }

  deleteExecution(row: Execution) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = 'Do you really want to delete job execution with ID ' + row.id + '?';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.executionService
            .deleteJobExecution(row.jobId, row.id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              () => {
                this.toastrService.success('Job execution with ID ' + row.id + ' deleted');
                this.list();
              },
              error => {
                this.toastrService.error('Could not delete job execution with ID ' + row.id + ': ' + error.message);
              }
            );
        }
      },
      () => {}
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
