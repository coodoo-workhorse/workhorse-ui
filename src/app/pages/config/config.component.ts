import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkhorseConfig } from 'src/services/workhorseConfig.model';
import { Config } from '../../../services/config.model';
import { ConfigService } from '../../../services/config.service';
import { RefreshIntervalService } from '../../../services/refresh-interval.service';
import { RefreshService } from '../../../services/refresh.service';
import { TimeZones } from '../../../services/time-zones.model';
import { WorkhorseCookieService } from '../../../services/workhorse-cookie.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit, OnDestroy {
  config: WorkhorseConfig;
  workhorseVersion: string;
  timezones: TimeZones;
  loading: boolean;
  edit: boolean;
  extraConfigs = false;

  configFields: Array<string> = [
    'bufferPollInterval',
    'bufferMax',
    'bufferMin',
    'executionTimeout',
    'executionTimeoutStatus',
    'logChange',
    'logTimeFormat',
    'logInfoMarker',
    'logWarnMarker',
    'logErrorMarker',
    'persistenceName',
    'persistenceVersion',
    'timeZone',
    'bufferPushFallbackPollInterval',
    'maxExecutionSummaryLength',
    'minutesUntilCleanup'
  ];

  private unsubscribe = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private toastrService: ToastrService,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService,
    public workhorseCookieService: WorkhorseCookieService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.edit = false;
    this.loadConfig();
    this.configService.getTimeZones().subscribe((timezones: TimeZones) => {
      this.timezones = timezones;
    });

    this.refreshIntervalService.refreshIntervalChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.loadConfig();
    });

    this.refreshService.refreshChanged$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.loadConfig();
    });
  }

  loadConfig() {
    this.loading = true;
    this.configService.getConfig().subscribe((config: Config) => {
      this.config = config.workhorseConfig;
      this.workhorseVersion = config.workhorseVersion;
      this.extraConfigs = this.configFields.length < Object.keys(this.config).length;
      this.loading = false;
    });
  }

  updateConfig(name: string, attribute: string, newValue: any): boolean {
    const oldValue = this.config[attribute];
    if (oldValue === newValue) {
      return;
    }
    if (newValue === '') {
      newValue = null;
    }
    this.loading = true;

    this.config[attribute] = newValue;
    this.configService.updateConfig(this.config).subscribe(
      (config: WorkhorseConfig) => {
        this.config = config;
        this.loading = false;
        this.toastrService.success(`Changed <strong>${name}</strong><br>from <i>${oldValue}</i><br>to <i>${newValue}</i>`);
      },
      () => {
        this.config[attribute] = oldValue;
        this.toastrService.error(`Could not change <strong>${name}</strong><br>from <i>${oldValue}</i><br>to <i>${newValue}</i>!`);
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
