import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CooTableListingService, ListingParameters, ListingResult, Metadata } from '@coodoo/coo-table';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Job } from 'src/services/job.model';
import { JobStore } from '../../../services/job.store';
import { Log } from '../../../services/log.model';
import { LogService } from '../../../services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit, OnDestroy {
  @Input() embedded = false;
  @Input() jobId: number;

  rows: Array<Log> = [];
  metadata: Metadata;
  limit = 20;
  job: Job;
  loading: boolean;
  hostname: boolean;
  status: Array<string> = ['ACTIVE', 'INACTIVE', 'ERROR', 'NO_WORKER'];

  private alive = true;
  private listingServiceSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobStore: JobStore,
    private logService: LogService,
    private listingParameters: ListingParameters,
    public cooTableListingService: CooTableListingService
  ) {}

  ngOnInit() {
    this.loading = false;
    this.hostname = false;
    this.cooTableListingService.setDefaultLimit(this.limit);

    if (!this.jobId) {
      this.jobId = this.route.snapshot.params.jobId;
    }
    if (this.jobId) {
      this.listingParameters.attributeFilters.set('jobId', '' + this.jobId);
      this.jobStore.jobs$.subscribe(() => {
        this.job = this.jobStore.getJob(+this.jobId);
      });
    }
    this.listingServiceSubscription = this.cooTableListingService.list$.subscribe(() => {
      this.list();
    });
  }

  list() {
    this.loading = true;
    this.rows = [];
    this.logService
      .getJobLogs(this.listingParameters)
      .pipe(takeWhile(() => this.alive))
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

  ngOnDestroy() {
    this.alive = false;
    this.listingServiceSubscription.unsubscribe();
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
}