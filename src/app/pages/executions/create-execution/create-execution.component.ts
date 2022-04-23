import { Component, OnInit } from '@angular/core';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Execution } from 'src/services/execution.model';
import { Job } from 'src/services/job.model';
import { ExecutionService } from '../../../../services/execution.service';
import { JobStore } from '../../../../services/job.store';

@Component({
  selector: 'app-create-execution',
  templateUrl: './create-execution.component.html',
  styleUrls: ['./create-execution.component.css']
})
export class CreateExecutionComponent implements OnInit {
  job: Job;
  execution: Execution;
  newExecution = new Execution();
  loading = false;
  minPlannedFor = new Date();
  timezoneOffsetMillis = this.minPlannedFor.getTimezoneOffset() * 1000 * 60;
  displayCreatedAt: Date;
  displayPlannedFor: Date;
  textareaRows = 5;

  constructor(
    public activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private jobStore: JobStore,
    private executionService: ExecutionService,
    private dateTimeAdapter: DateTimeAdapter<any>
  ) {
    this.dateTimeAdapter.setLocale('en-GB');
    this.minPlannedFor = this.patchDate(this.minPlannedFor);
  }

  ngOnInit() {
    this.loading = true;
    if (!this.job) {
      this.jobStore.jobs$.subscribe(jobs => {
        this.job = this.jobStore.getJob(this.execution.jobId);
        this.initExecution();
      });
    } else {
      this.initExecution();
    }
  }

  initExecution() {
    if (this.execution) {
      this.newExecution.priority = this.execution.priority;
      let jsonParameters = null;
      if (this.execution.parameters) {
        jsonParameters = JSON.stringify(JSON.parse(this.execution.parameters), null, 2);
      }
      this.newExecution.parameters = jsonParameters;
      this.updateTextareaRows();
    }
    this.loading = false;
  }

  getLatestParameters() {
    this.loading = true;
    this.executionService.getLatestParameters(this.job.id).subscribe((parameters: string) => {
      let latestParameters = null;
      if (parameters) {
        latestParameters = JSON.stringify(parameters, null, 2);
      }
      this.newExecution.parameters = latestParameters;
      this.updateTextareaRows();
      this.loading = false;
    });
  }

  getRandomParameters() {
    this.loading = true;
    this.executionService.getRandomParameters(this.job.id).subscribe((parameters: string) => {
      if (parameters) {
        this.newExecution.parameters = JSON.stringify(parameters, null, 2);
        this.updateTextareaRows();
      }
      this.loading = false;
    });
  }

  updateTextareaRows() {
    if (this.newExecution.parameters) {
      this.textareaRows = this.newExecution.parameters.split(/\r\n|\r|\n/).length;
    }
  }

  clearPlannedFor() {
    this.newExecution.plannedFor = null;
    this.updateDisplayDates();
  }
  updateDisplayDates() {
    this.minPlannedFor = new Date();
    this.displayCreatedAt = this.patchDate(this.minPlannedFor);
    this.displayPlannedFor = this.patchDate(this.newExecution.plannedFor);
    if (this.displayCreatedAt && this.displayPlannedFor && this.displayCreatedAt > this.displayPlannedFor) {
      this.displayCreatedAt = this.displayPlannedFor;
    }
  }

  patchDate(date: Date) {
    if (date) {
      return new Date(date.getTime() - this.timezoneOffsetMillis);
    }
    return null;
  }

  createExecution() {
    this.newExecution.plannedFor = this.patchDate(this.newExecution.plannedFor);
    this.loading = true;
    this.executionService.createJobExecution(this.job.id, this.newExecution).subscribe(
      (createdeExecution: Execution) => {
        this.toastrService.success('Execution created with ID ' + createdeExecution.id);
        this.loading = false;
        this.activeModal.close(createdeExecution);
      },
      (error: any) => {
        this.toastrService.error('Could not create execution: ' + error.message);
        this.toastrService.error(error.name, error.message);
        this.loading = false;
      }
    );
  }
}
