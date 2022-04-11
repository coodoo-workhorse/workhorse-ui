import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ExecutionLog } from 'src/services/execution-log.model';
import { Execution } from 'src/services/execution.model';
import { Job } from 'src/services/job.model';
import { ExecutionService } from '../../../../services/execution.service';
import { JobStore } from '../../../../services/job.store';
import { CreateExecutionComponent } from '../create-execution/create-execution.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.css']
})
export class ExecutionComponent implements OnInit {
  executionId: number;
  jobId: number;
  execution: Execution;
  executionLog: ExecutionLog;
  job: Job;
  loading = true;
  reloading: boolean;

  private config: any = { size: 'md' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private jobStore: JobStore,
    private executionService: ExecutionService,
    private toastrService: ToastrService,
    private location: Location,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.executionId = this.activatedRoute.snapshot.params.executionId;
    this.jobId = this.activatedRoute.snapshot.params.jobId;
    this.loadExecution();
  }

  loadExecution() {
    this.reloading = true;
    this.executionService.getExecution(this.jobId, this.executionId).subscribe((execution: Execution) => {
      this.execution = execution;
      // FIXME: timeline neu rendern
      if (!this.job) {
        this.jobStore.jobs$.subscribe(jobs => {
          this.job = this.jobStore.getJob(this.jobId);
          this.loading = false;
          this.reloading = false;
        });
      } else {
        this.loading = false;
        this.reloading = false;
      }
    });

    this.executionService.getExecutionLog(this.jobId, this.executionId).subscribe((executionLog: ExecutionLog) => {
      this.executionLog = executionLog;
    });
  }

  cloneExecution() {
    const modalRef: any = this.modalService.open(CreateExecutionComponent, this.config);

    modalRef.componentInstance.job = this.job;
    modalRef.componentInstance.execution = this.execution;
    modalRef.result.then(() => {}).catch(() => {});
  }

  showBatch(batchId: number) {
    this.router.navigate([`jobs/${this.execution.jobId}/executions/${batchId}/batch`]);
  }

  showChain(chainId: number) {
    this.router.navigate([`jobs/${this.execution.jobId}/executions/${chainId}/chain`]);
  }

  abortExecution() {
    const oldStatus = this.execution.status;
    const oldUpdatedAt = this.execution.updatedAt;
    this.execution.status = 'ABORTED';
    this.execution.updatedAt = new Date();

    this.executionService.updateJobExecution(this.execution.jobId, this.execution).subscribe(
      (execution: Execution) => {
        this.toastrService.info('Abort job execution');
        this.execution = execution;
      },
      error => {
        this.execution.status = oldStatus;
        this.execution.updatedAt = oldUpdatedAt;
        this.toastrService.error('Could not abort job execution: ' + error.message);
      }
    );
  }

  redoExecution() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = 'Redo job execution? All metadata like timestamps and logs of this execution will be gone!';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.executionService.redoJobExecution(this.execution.jobId, this.execution.id).subscribe(
            (execution: Execution) => {
              this.toastrService.info('Redo job execution');
              this.execution = execution;
            },
            error => {
              this.toastrService.error('Could not redo job execution: ' + error.message);
            }
          );
        }
      },
      () => {}
    );
  }

  stringifyParameters(execution: Execution): string {
    try {
      return JSON.stringify(JSON.parse(execution.parameters), null, 2);
    } catch (e) {
      return execution.parameters;
    }
  }

  showFailRetryExecution() {
    this.router.navigate([`jobs/${this.execution.jobId}/executions/${this.execution.failRetryExecutionId}`]);
    this.executionId = this.execution.failRetryExecutionId;
    this.loadExecution();
  }

  navigateBack() {
    this.location.back();
  }
}
