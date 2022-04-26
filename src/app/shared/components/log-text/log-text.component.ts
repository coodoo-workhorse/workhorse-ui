import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingParameters, ListingResult, Metadata } from '@coodoo/coo-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { Log } from '../../../../services/log.model';
import { LogService } from '../../../../services/logs.service';
import { WorkhorseCookieService } from '../../../../services/workhorse-cookie.service';

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
  logTextLinesMin = 10;
  logTextLinesMax = 200;

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private logService: LogService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService,
    public workhorseCookieService: WorkhorseCookieService
  ) {}

  ngOnInit() {
    this.limit = this.workhorseCookieService.cookie.logTextLines;
    this.loading = false;
    this.logging = false;
    this.listingParameters = new ListingParameters();
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

  lessLogTextLines() {
    let lines = this.workhorseCookieService.cookie.logTextLines;
    lines -= this.logTextLinesMin;
    if (lines >= this.logTextLinesMin) {
      this.listingParameters.limit = lines;
      this.workhorseCookieService.setCookieValue('logTextLines', lines);
      this.list();
    }
  }

  moreLogTextLines() {
    if (this.workhorseCookieService.cookie.logTextLines <= this.logTextLinesMax) {
      let lines = this.workhorseCookieService.cookie.logTextLines;
      lines += this.logTextLinesMin;
      this.listingParameters.limit = lines;
      this.workhorseCookieService.setCookieValue('logTextLines', lines);
      this.list();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
