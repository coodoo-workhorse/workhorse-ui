import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingParameters, ListingResult } from '@coodoo/coo-table';
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

/**
 * Execution aus Job oder vergangener Execution erstellen.
 */
export class CreateExecutionComponent implements OnInit {
  job: Job;
  execution: Execution;
  executionForm: FormGroup;
  loading = false;
  onExecuted = false;
  isExecution = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private jobStore: JobStore,
    private executionService: ExecutionService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.executionForm = this.formBuilder.group({
      jobId: [undefined, Validators.required],
      priority: [undefined, Validators.required],
      plannedFor: [undefined],
      parameters: [undefined],
      plannedForDate: [undefined],
      plannedForTime: [undefined]
    });

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
      this.updateForm(this.execution);
    } else {
      this.getLastExecution();
    }
  }

  getLastExecution() {
    this.isExecution = false;

    const listingParameters = new ListingParameters();
    listingParameters.limit = 1;
    this.executionService.getJobExecutions(listingParameters, this.job.id).subscribe((execList: ListingResult<Execution>) => {
      this.execution = execList.results[0];
      if (this.execution) {
        if (this.execution.parameters) {
          this.isExecution = true;
        }
        this.updateForm(this.execution);
      }
      this.loading = false;
    });
  }

  updateForm(execution: Execution) {
    let jsonParameters;
    if (execution.parameters) {
      jsonParameters = JSON.stringify(JSON.parse(execution.parameters), null, 2);
    }
    this.executionForm.patchValue({
      jobId: execution.jobId,
      priority: execution.priority,
      parameters: jsonParameters
    });
    this.loading = false;
  }

  onExecute() {
    this.onExecuted = true;
    this.createExecution();
  }

  createExecutioData(): Execution {
    if (this.executionForm.get('plannedForDate').touched && this.executionForm.get('plannedForTime').touched) {
      const deadline: Date = new Date();
      deadline.setFullYear(this.executionForm.value.plannedForDate.year);
      deadline.setMonth(this.executionForm.value.plannedForDate.month - 1);
      deadline.setDate(this.executionForm.value.plannedForDate.day);
      deadline.setHours(this.executionForm.value.plannedForTime.hour);
      deadline.setMinutes(this.executionForm.value.plannedForTime.minute);
      this.executionForm.patchValue({ plannedFor: deadline });
    }

    const exec: Execution = new Execution();
    exec.jobId = this.executionForm.value.jobId;
    exec.priority = this.executionForm.value.priority;
    exec.plannedFor = this.executionForm.value.plannedFor;
    exec.parameters = this.executionForm.value.parameters;
    return exec;
  }

  createExecution() {
    const exec: Execution = this.createExecutioData();
    this.loading = true;
    this.executionService.createJobExecution(this.job.id, exec).subscribe(
      (execution: Execution) => {
        this.toastrService.success('Execution created');
        this.loading = false;
        this.activeModal.close(execution);
      },
      (error: any) => {
        this.toastrService.error('Could not create execution: ' + error.message);
        this.toastrService.error(error.name, error.message);
        this.loading = false;
      }
    );
  }
}