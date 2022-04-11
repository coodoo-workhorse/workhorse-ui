import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CooTableListingService, ListingParameters, ListingResult } from '@coodoo/coo-table';
import { Observable } from 'rxjs';
import { JobStatusCount } from './job-status-count.model';
import { Job } from './job.model';
import { RestConfig } from './rest.config';

@Injectable()
export class JobService {

  constructor(
    private http: HttpClient,
    private CooTableListingService: CooTableListingService
  ) { }

  getJobs(listingParameters: ListingParameters): Observable<ListingResult<Job>> {
    const httpParams: HttpParams = this.CooTableListingService.createHttpParams(listingParameters);
    return this.http.get<ListingResult<Job>>(`${RestConfig.apiUrl}/jobs`, { params: httpParams });
  }

  getJob(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${RestConfig.apiUrl}/jobs/${jobId}`);
  }

  updateJob(job: Job): Observable<Job> {
    return this.http.put<Job>(`${RestConfig.apiUrl}/jobs/${job.id}`, job);
  }

  deleteJob(jobId: number): Observable<object> {
    return this.http.delete(`${RestConfig.apiUrl}/jobs/${jobId}`);
  }

  activateJob(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${RestConfig.apiUrl}/jobs/${jobId}/activate`);
  }

  deactivateJob(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${RestConfig.apiUrl}/jobs/${jobId}/deactivate`);
  }

  triggerScheduledExecutionCreation(job: Job): Observable<Job> {
    return this.http.post<Job>(`${RestConfig.apiUrl}/jobs/${job.id}/trigger-schedule`, job);
  }

  getJobStatusCount(): Observable<JobStatusCount> {
    return this.http.get<JobStatusCount>(`${RestConfig.apiUrl}/jobs/status-counts`);
  }
}
