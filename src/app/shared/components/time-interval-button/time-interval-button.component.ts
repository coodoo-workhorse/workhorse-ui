import { Component } from '@angular/core';
import { RefreshIntervalService } from 'src/services/refresh-interval.service';
@Component({
  selector: 'time-interval-button',
  templateUrl: './time-interval-button.component.html',
  styleUrls: ['./time-interval-button.component.css']
})
export class TimeIntervalButtonComponent {
  intervals: Map<number, string> = new Map([
    [0, 'Off'],
    [10000, '10 seconds'],
    [60000, '1 minutes'],
    [120000, '2 minutes'],
    [300000, '5 minutes'],
    [900000, '15 minutes']
  ]);

  intervalText: string;
  blinkInterval = false;

  constructor(private refreshIntervalService: RefreshIntervalService) {
    this.intervalText = this.intervals.get(this.refreshIntervalService.getInterval());
    this.refreshIntervalService.refreshIntervalChanged$.subscribe(() => {
      this.blinkInterval = false;
      setTimeout(() => {
        this.blinkInterval = true;
      }, 0);
    });
  }

  changeInterval(selectedIntervalKey: number, selectedIntervalValue: string) {
    this.refreshIntervalService.setInterval(selectedIntervalKey);
    this.intervalText = selectedIntervalValue;
  }
}
