import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { WorkhorseCookie } from './workhorse-cookie.model';

@Injectable({
  providedIn: 'root'
})
export class WorkhorseCookieService {
  name: string = 'workhorse-cookie-v';
  version: number = 1;
  cookie: WorkhorseCookie;

  constructor(private cookieService: CookieService) {
    this.loadCookie();
  }

  private loadCookie(): void {
    const cookie = this.cookieService.get(`${this.name}${this.version}`);
    if (cookie) {
      const cookieValue = JSON.parse(cookie);
      this.cookie = cookieValue;
    } else {
      // TODO check for older versions and map values if possible

      // create Cookie with Default Values
      this.resetCookie();
    }
  }

  /**
   * Restore Default Values
   */
  public resetCookie(): void {
    this.cookie = new WorkhorseCookie();
    this.saveCookie();
  }

  private saveCookie(): void {
    this.cookieService.put(`${this.name}${this.version}`, JSON.stringify(this.cookie));
  }

  public setCookieValue(key: string, value: any): void {
    for (var cookieKey in this.cookie) {
      if (Object.prototype.hasOwnProperty.call(this.cookie, cookieKey) && cookieKey === key) {
        this.cookie[key] = value;
        this.cookie.updatedAt = new Date();
        this.saveCookie();
        return;
      }
    }
  }

  public getWorkhorseCookie(): WorkhorseCookie {
    return this.cookie;
  }
}
