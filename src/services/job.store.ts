import { Injectable } from '@angular/core';
import { ListingParameters } from '@coodoo/coo-table';
import { BehaviorSubject } from 'rxjs';
import { Job } from './job.model';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root'
})
export class JobStore {
  private jobs = new BehaviorSubject<Job[]>([]);
  jobs$ = this.jobs.asObservable();

  constructor(private jobService: JobService) { }

  async initJobs(): Promise<any> {
    return this.jobService.getJobs({ limit: 1000 } as ListingParameters).toPromise()
    .then(jobs => {
      this.setJobs(jobs.results);
    });
  }

  getJobs(): Job[] {
    return this.jobs.getValue();
  }

  setJobs(val: Job[]) {
    this.jobs.next(val);
  }

  getJob(jobId: number): Job {
    for (const job of this.getJobs()) {
      if (jobId === job.id) {
        return job;
      }
    }
    return null;
  }
}
