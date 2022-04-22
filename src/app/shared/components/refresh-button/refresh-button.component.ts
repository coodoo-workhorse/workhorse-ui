import { Component, Input, OnInit } from '@angular/core';
import { RefreshService } from 'src/services/refresh.service';

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

  @Input() global = false;

  constructor(private refreshService: RefreshService) {}

  ngOnInit() {
    if (!this.popoverText) {
      this.popoverText = 'Refresh';
    }
  }

  refresh() {
    if (this.global) {
      this.refreshService.refresh();
    }
  }
}
