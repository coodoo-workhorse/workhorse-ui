import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from './config.model';
import { RestConfig } from './rest.config';
import { TimeZones } from './time-zones.model';
import { WorkhorseConfig } from './workhorseConfig.model';

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {}

  getConfig(): Observable<Config> {
    return this.http.get<Config>(`${RestConfig.apiUrl}/config`);
  }

  updateConfig(config: WorkhorseConfig): Observable<WorkhorseConfig> {
    return this.http.put<WorkhorseConfig>(`${RestConfig.apiUrl}/config`, config);
  }
  getTimeZones(): Observable<TimeZones> {
    return this.http.get<TimeZones>(`${RestConfig.apiUrl}/config/timezones`);
  }
}
