import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CooTableListingService, ListingParameters, ListingResult } from '@coodoo/coo-table';
import { Observable } from 'rxjs';
import { ExecutionStatusCounts } from './execution-status-counts.model';
import { ExecutionGroupInfo } from './execution-group-info.model';
import { ExecutionLog } from './execution-log.model';
import { Execution } from './execution.model';
import { RestConfig } from './rest.config';

@Injectable()
export class ExecutionService {
  constructor(private http: HttpClient, private cooTableListingService: CooTableListingService) {}

  getJobExecutions(listingParams: ListingParameters, jobId: number): Observable<ListingResult<Execution>> {
    const queryParams: HttpParams = this.cooTableListingService.createHttpParams(listingParams);
    return this.http.get<ListingResult<Execution>>(`${RestConfig.apiUrl}/jobs/${jobId}/executions`, { params: queryParams });
  }

  getExecution(jobId: number, executionId: number): Observable<Execution> {
    return this.http.get<Execution>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/${executionId}`);
  }

  createJobExecution(jobId: number, execution: Execution): Observable<Execution> {
    return this.http.post<Execution>(`${RestConfig.apiUrl}/jobs/${jobId}/executions`, execution);
  }

  updateJobExecution(jobId: number, execution: Execution): Observable<Execution> {
    return this.http.put<Execution>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/${execution.id}`, execution);
  }

  deleteJobExecution(jobId: number, executionId: number): Observable<object> {
    return this.http.delete(`${RestConfig.apiUrl}/jobs/${jobId}/executions/${executionId}`);
  }

  redoJobExecution(jobId: number, executionId: number): Observable<Execution> {
    return this.http.get<Execution>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/${executionId}/redo`);
  }

  getExecutionLog(jobId: number, executionId: number): Observable<ExecutionLog> {
    return this.http.get<ExecutionLog>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/${executionId}/log`);
  }

  getBatchInfo(jobId: number, batchId: number): Observable<ExecutionGroupInfo> {
    return this.http.get<ExecutionGroupInfo>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/batch/${batchId}`);
  }

  getChainInfo(jobId: number, chainId: number): Observable<ExecutionGroupInfo> {
    return this.http.get<ExecutionGroupInfo>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/chain/${chainId}`);
  }

  getStatusCounts(jobId: number, minutes: number): Observable<ExecutionStatusCounts> {
    if (!jobId) {
      jobId = -1;
    }
    if (!minutes) {
      minutes = 1440;
    }
    return this.http.get<ExecutionStatusCounts>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/status-counts/${minutes}`);
  }

  getRandomParameters(jobId: number): Observable<string> {
    return this.http.get<string>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/random-parameters`);
  }

  getLatestParameters(jobId: number): Observable<string> {
    return this.http.get<string>(`${RestConfig.apiUrl}/jobs/${jobId}/executions/latest-parameters`);
  }
}
