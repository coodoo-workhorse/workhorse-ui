import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CooTableListingService, ListingParameters, ListingResult, Metadata } from '@coodoo/coo-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job } from 'src/services/job.model';
import { WorkhorseCookieService } from 'src/services/workhorse-cookie.service';
import { JobStore } from '../../../services/job.store';
import { Log } from '../../../services/log.model';
import { LogService } from '../../../services/logs.service';
import { RefreshIntervalService } from '../../../services/refresh-interval.service';
import { RefreshService } from '../../../services/refresh.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
  providers: [CooTableListingService]
})
export class LogsComponent implements OnInit, OnDestroy {
  @Input() embedded = false;
  @Input() jobId: number;

  rows: Array<Log> = [];
  metadata: Metadata;
  listingParameters: ListingParameters;

  job: Job;
  loading: boolean;
  hostname: boolean;
  status: Array<string> = ['ACTIVE', 'INACTIVE', 'ERROR', 'NO_WORKER'];

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobStore: JobStore,
    private logService: LogService,
    private cooTableListingService: CooTableListingService,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService,
    private workhorseCookieService: WorkhorseCookieService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.hostname = false;

    this.cooTableListingService.setMetadata({
      limit: this.workhorseCookieService.getWorkhorseCookie().logsListingLimit,
      sort: this.workhorseCookieService.getWorkhorseCookie().logsListingSort
    } as Metadata);

    if (!this.jobId) {
      this.jobId = this.route.snapshot.params.jobId;
    }

    if (this.jobId) {
      this.cooTableListingService.filterTable({
        column: 'jobId',
        value: this.jobId
      });

      this.jobStore.jobs$.subscribe(() => {
        this.job = this.jobStore.getJob(+this.jobId);
      });
    }

    this.cooTableListingService.list$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.list();
    });

    this.cooTableListingService.metadata$.pipe(takeUntil(this.unsubscribe)).subscribe((metadata) => {
      this.workhorseCookieService.setCookieValue('logsListingLimit', metadata.limit);
      this.workhorseCookieService.setCookieValue('logsListingSort', metadata.sort);
    });
  }

  list() {
    this.loading = true;
    this.rows = [];
    this.logService
      .getJobLogs(this.cooTableListingService.getListingParameters())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((listingResult: ListingResult<Log>) => {
        this.rows = listingResult.results;
        this.metadata = listingResult.metadata;
        if (!this.jobId) {
          for (let index = 0; index < this.rows.length; index++) {
            if (this.rows[index].jobId) {
              this.rows[index].job = this.jobStore.getJob(this.rows[index].jobId);
            }
          }
        }
        this.loading = false;
      });
  }

  showLog(log: Log) {
    if (!log.id) {
      return;
    }
    this.router.navigate([`logs/${log.id}`]);
  }

  showJob(log: Log) {
    this.router.navigate([`jobs/${log.jobId}`]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
