import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { interval, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshIntervalService {
  private refreshIntervalChanged = new Subject<void>();
  refreshIntervalChanged$ = this.refreshIntervalChanged.asObservable();

  refreshInterval = 10000;

  timerSubscription: Subscription;

  private refreshIntervalCookieName = 'wh-view-refresh-interval-v1';

  constructor(private cookieService: CookieService) {
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
    const cookieValue = {
      refreshInterval: this.refreshInterval
    };
    this.cookieService.put(this.refreshIntervalCookieName, JSON.stringify(cookieValue));
  }

  getIntervalFromCookie() {
    const cookie = this.cookieService.get(this.refreshIntervalCookieName);
    if (cookie) {
      const cookieValue = JSON.parse(cookie);
      this.refreshInterval = cookieValue.refreshInterval;
    }
  }
}
