import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingParameters, ListingResult, Metadata } from '@coodoo/coo-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { Log } from '../../../../services/log.model';
import { LogService } from '../../../../services/logs.service';

@Component({
  selector: 'log-text',
  templateUrl: './log-text.component.html',
  styleUrls: ['./log-text.component.css']
})
export class LogTextComponent implements OnInit, OnDestroy {
  @Input()
  jobId: number;

  @Input()
  limit: number;

  rows: Array<Log> = [];
  metadata: Metadata;
  listingParameters: ListingParameters;
  loading: boolean;
  logging: boolean;

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private logService: LogService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService
  ) {}

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

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });
  }

  list() {
    this.loading = true;
    this.rows = [];
    this.logService
      .getJobLogs(this.listingParameters)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((listingResult: ListingResult<Log>) => {
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
