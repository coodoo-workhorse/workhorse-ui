import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobThread } from 'src/services/job-thread.model';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
import { RefreshService } from 'src/services/refresh.service';
import { WorkhorseService } from 'src/services/workhorse.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit, OnDestroy {
  loading: boolean;
  jobThreads: JobThread[];

  private unsubscribe = new Subject<void>();

  constructor(
    private workhorseService: WorkhorseService,
    private refreshService: RefreshService,
    private refreshIntervalService: RefreshIntervalService
  ) {}

  ngOnInit() {
    this.getRunningThread();

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getRunningThread();
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.getRunningThread();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getRunningThread() {
    this.loading = true;
    this.workhorseService
      .getRunningThread()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: JobThread[]) => {
        this.jobThreads = data;
        this.loading = false;
      });
  }
}
