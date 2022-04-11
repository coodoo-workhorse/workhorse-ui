import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'refresh-button',
  templateUrl: './refresh-button.component.html',
  styleUrls: ['./refresh-button.component.css'],
  preserveWhitespaces: true
})
export class RefreshButtonComponent implements OnInit {
  @Input() refreshing: boolean;
  @Input() text: string;
  @Input() popoverText: string;

  ngOnInit() {
    if (!this.popoverText) {
      this.popoverText = 'Refresh';
    }
  }
}
