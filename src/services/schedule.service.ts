import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobScheduleExecution } from './job-schedule-execution.model';
import { RestConfig } from './rest.config';

@Injectable()
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getDescription(schedule: string): Observable<string> {
    let httpParams: HttpParams;
    httpParams = new HttpParams().set('schedule', `${schedule}`);
    return this.http.get<string>(`${RestConfig.apiUrl}/schedules/description`, { params: httpParams });
  }

  getNextScheduledTimes(schedule: string, times: number): Observable<Date[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('schedule', schedule);
    httpParams = httpParams.set('times', `${times}`);
    return this.http.get<Date[]>(`${RestConfig.apiUrl}/schedules/next-scheduled-times`, { params: httpParams });
  }

  getAllScheduledTimes(start: Date, end: Date): Observable<Array<JobScheduleExecution>> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('start', start.toISOString());
    httpParams = httpParams.set('end', end.toISOString());
    return this.http.get<Array<JobScheduleExecution>>(`${RestConfig.apiUrl}/schedules/all-scheduled-times`, { params: httpParams });
  }
}
