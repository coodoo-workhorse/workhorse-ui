import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'job-execution-status',
  templateUrl: './job-execution-status.component.html',
  styleUrls: ['./job-execution-status.component.css']
})
export class JobExecutionStatusComponent implements OnInit {
  @Input() status: string;
  @Input() link = true;
  @Input() count: number;
  @Input() countOnly = false;
  @Input() jobId: number;
  @Input() groupId: number;

  path: string;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.jobId) {
      this.path = '/jobs/' + this.jobId + '?filter-status=' + this.status;
    } else {
      this.link = false;
    }
  }

  // https://stackoverflow.com/a/60505990
  goToLink() {
    this.router.navigateByUrl(this.path);
  }
}
