import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private refreshChanged = new Subject<void>();
  refreshChanged$ = this.refreshChanged.asObservable();

  refresh() {
    this.refreshChanged.next();
  }
}
