import { Component, Input } from '@angular/core';

@Component({
  selector: 'job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.css']
})
export class JobStatusComponent {
  @Input() status: string;
  @Input() link = true;
  @Input() count: number;

  public statusQueryParam(): string {
    return `"${this.status}"`;
  }
}
