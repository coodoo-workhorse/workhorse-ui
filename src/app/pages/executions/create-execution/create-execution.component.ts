import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListingParameters, ListingResult } from '@coodoo/coo-table';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
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

   minPlannedFor = new Date();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private jobStore: JobStore,
    private executionService: ExecutionService,
    private dateTimeAdapter: DateTimeAdapter<any>
  ) {
    this.dateTimeAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.loading = true;
    this.executionForm = this.formBuilder.group({
      jobId: [undefined, Validators.required],
      priority: [undefined, Validators.required],
      plannedFor: [undefined],
      parameters: [undefined],
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
    const exec: Execution = new Execution();
    exec.jobId = this.executionForm.value.jobId;
    exec.priority = this.executionForm.value.priority;

    if(this.executionForm.value.plannedFor){
      const now = new Date();
      let timezoneOffsetMillis = now.getTimezoneOffset() * 1000 * 60;
      const plannedFor = new Date( this.executionForm.value.plannedFor.getTime() - timezoneOffsetMillis );
      if(now.getTime() > plannedFor.getTime()){
        timezoneOffsetMillis = now.getTime();
      }
      exec.plannedFor = plannedFor;
    }

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
