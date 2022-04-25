import { Injectable } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { WorkhorseCookieService } from './workhorse-cookie.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshIntervalService {
  private refreshIntervalChanged = new Subject<void>();
  refreshIntervalChanged$ = this.refreshIntervalChanged.asObservable();

  refreshInterval = 10000;

  timerSubscription: Subscription;

  private refreshIntervalCookieName = 'wh-view-refresh-interval-v1';

  constructor(private workhorseCookieService: WorkhorseCookieService) {
    this.getIntervalFromCookie();
    this.startTimer();
  }

  startTimer() {
    if (this.refreshInterval > 0) {
      this.timerSubscription = interval(this.refreshInterval).subscribe(() => {
        this.refreshIntervalChanged.next();
      });
    }
  }

  setInterval(interval: number) {
    this.refreshInterval = interval;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.startTimer();
    this.saveIntervalInCookie();
  }

  getInterval(): number {
    return this.refreshInterval;
  }

  saveIntervalInCookie() {
    this.workhorseCookieService.setCookieValue('refreshInterval', this.refreshInterval);
  }

  getIntervalFromCookie() {
    this.refreshInterval = this.workhorseCookieService.getWorkhorseCookie().refreshInterval;
  }
}
