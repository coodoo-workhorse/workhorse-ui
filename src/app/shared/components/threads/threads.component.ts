import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { JobThread } from 'src/services/job-thread.model';
import { WorkhorseService } from 'src/services/workhorse.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent implements OnInit {
  loading: boolean;
  jobThreads: JobThread[];

  constructor(private workhorseService: WorkhorseService, private toastrService: ToastrService) {}

  ngOnInit() {
    this.getRunningThread();
  }

  getRunningThread() {
    this.loading = true;
    this.workhorseService.getRunningThread().subscribe((data: JobThread[]) => {
      this.jobThreads = data;
      this.loading = false;
    });
  }
}
