import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from 'src/services/job.model';
import { Log } from 'src/services/log.model';
import { JobStore } from '../../../../services/job.store';
import { LogService } from '../../../../services/logs.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  logId: number;
  log: Log;
  job: Job;
  loading: boolean;

  constructor(private route: ActivatedRoute, private jobStore: JobStore, private logService: LogService, private location: Location) {}

  ngOnInit() {
    this.logId = this.route.snapshot.params.logId;
    this.loading = true;
    this.logService.getLog(this.logId).subscribe((log: Log) => {
      this.log = log;
      if (log.jobId) {
        this.jobStore.jobs$.subscribe(jobs => {
          this.job = this.jobStore.getJob(log.jobId);
        });
      }
      this.loading = false;
    });
  }

  navigateBack() {
    this.location.back();
  }
}
