import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CooTableListingService, ListingParameters, ListingResult } from '@coodoo/coo-table';
import { Observable } from 'rxjs';
import { Log } from './log.model';
import { RestConfig } from './rest.config';

@Injectable()
export class LogService {
  constructor(private http: HttpClient, private cooTableListingService: CooTableListingService) {}

  getJobLogs(listingParams: ListingParameters): Observable<ListingResult<Log>> {
    const queryParams: HttpParams = this.cooTableListingService.createHttpParams(listingParams);
    return this.http.get<ListingResult<Log>>(`${RestConfig.apiUrl}/logs`, { params: queryParams });
  }

  getLog(logId: number): Observable<Log> {
    return this.http.get<Log>(`${RestConfig.apiUrl}/logs/${logId}`);
  }

  createLogMessage(message: string): Observable<Log> {
    return this.http.post<Log>(`${RestConfig.apiUrl}/logs`, message);
  }

  createLogMessageForJob(jobId: number, message: string): Observable<Log> {
    return this.http.post<Log>(`${RestConfig.apiUrl}/logs/${jobId}`, message);
  }
}
