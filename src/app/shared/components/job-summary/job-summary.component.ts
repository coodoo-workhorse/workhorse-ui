import { Component, Input, OnInit } from '@angular/core';
import { Job } from 'src/services/job.model';
import { WorkhorseService } from 'src/services/workhorse.service';
import { JobStore } from '../../../../services/job.store';

@Component({
  selector: 'job-summary',
  templateUrl: './job-summary.component.html',
  styleUrls: ['./job-summary.component.css']
})
export class JobSummaryComponent implements OnInit {
  @Input() jobId: number;
  @Input() job: Job;
  @Input() showStatus = true;

  constructor(private jobStore: JobStore) {}

  ngOnInit() {
    if (this.jobId) {
      this.jobStore.jobs$.subscribe(jobs => {
        this.job = this.jobStore.getJob(this.jobId);
      });
    }
  }
}
