import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingParameters, ListingResult, Metadata } from '@coodoo/coo-table';
import { Log } from '../../../../services/log.model';
import { LogService } from '../../../../services/logs.service';

@Component({
  selector: 'log-text',
  templateUrl: './log-text.component.html',
  styleUrls: ['./log-text.component.css']
})
export class LogTextComponent implements OnInit {
  @Input()
  jobId: number;

  @Input()
  limit: number;

  rows: Array<Log> = [];
  metadata: Metadata;
  listingParameters: ListingParameters;
  loading: boolean;
  logging: boolean;

  constructor(private router: Router, private logService: LogService) {}

  ngOnInit() {
    if (!this.limit) {
      this.limit = 20;
    }
    this.loading = false;
    this.logging = false;
    this.listingParameters = new ListingParameters();
    // this.listingParameters.sort = '-id';  // latest first
    this.listingParameters.limit = this.limit;
    if (this.jobId) {
      this.listingParameters.attributeFilters.set('jobId', '' + this.jobId);
    }
    this.list();
  }

  list() {
    this.loading = true;
    this.rows = [];
    this.logService.getJobLogs(this.listingParameters).subscribe((listingResult: ListingResult<Log>) => {
      this.rows = listingResult.results;
      this.metadata = listingResult.metadata;
      this.loading = false;
    });
  }

  showLog(log: Log) {
    this.router.navigate([`logs/${log.id}`]);
  }

  showLogs(jobId: number) {
    if (jobId) {
      this.router.navigate([`jobs/${jobId}/logs`]);
    } else {
      this.router.navigate([`logs`]);
    }
  }
}
