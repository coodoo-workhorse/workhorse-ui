import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'time-interval-button',
  templateUrl: './time-interval-button.component.html',
  styleUrls: ['./time-interval-button.component.css'],
  preserveWhitespaces: true
})
export class TimeIntervalButtonComponent implements OnInit {
  @Input() intervalText: string;
  @Input() intervals: Map<number, string>;
  @Output() selectedIntervalKey: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {}

  changeInterval(selectedIntervalKey: number, selectedIntervalValue: string) {
    this.intervalText = selectedIntervalValue;
    this.selectedIntervalKey.emit(selectedIntervalKey);
  }
}
