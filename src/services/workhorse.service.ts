import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobExecutionStatusSummaries } from './job-execution-status-summaries.model';
import { JobStatusCount } from './job-status-count.model';
import { JobThread } from './job-thread.model';
import { Job } from './job.model';
import { RestConfig } from './rest.config';

@Injectable()
export class WorkhorseService {
  constructor(private http: HttpClient) { }

  getWorkhorseStatus(): Observable<boolean> {
    return this.http.get<boolean>(`${RestConfig.apiUrl}/is-running`);
  }

  stopWorkhorse(): Observable<Response> {
    return this.http.get<Response>(`${RestConfig.apiUrl}/stop`);
  }

  startWorkhorse(): Observable<Response> {
    return this.http.get<Response>(`${RestConfig.apiUrl}/start`);
  }

  getJobExecutionStatusSummaries(status: string, lastMinutes: number) {
    let queryParams: HttpParams;
    if (lastMinutes) {
      queryParams = new HttpParams().set('last-minutes', `${lastMinutes}`);
    }
    return this.http.get<JobExecutionStatusSummaries>(`${RestConfig.apiUrl}/monitoring/job-execution-summary/${status}`, {
      params: queryParams
    });
  }

  getRunningThread(): Observable<JobThread[]> {
    return this.http.get<JobThread[]>(`${RestConfig.apiUrl}/monitoring/job-threads`);
  }
}
