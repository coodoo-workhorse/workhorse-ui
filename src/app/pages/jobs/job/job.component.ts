import { RefreshService } from './../../../../services/refresh.service';
import { RefreshIntervalService } from './../../../../services/refresh-interval.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Job } from 'src/services/job.model';
import { WorkhorseService } from 'src/services/workhorse.service';
import { JobService } from '../../../../services/job.service';
import { CreateExecutionComponent } from '../../executions/create-execution/create-execution.component';
import { WorkhorseCookieService } from '../../../../services/workhorse-cookie.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  jobId: number;
  job: Job;
  loading = true;
  reloading = false;
  edit = false;

  hiddeAdvancedFunction = false;
  randomWorkhorse: number;

  private config: NgbModalOptions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jobService: JobService,
    private toastrService: ToastrService,
    private location: Location,
    private modalService: NgbModal,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService,
    public workhorseCookieService: WorkhorseCookieService
  ) {
    this.config = { size: 'lg' };
  }

  ngOnInit() {
    this.refreshIntervalService.refreshIntervalChanged$.subscribe(() => {
      this.loadJob();
    });
    this.refreshService.refreshChanged$.subscribe(() => {
      this.loadJob();
    });

    this.jobId = this.route.snapshot.params.jobId;
    this.loadJob();
  }

  loadJob() {
    this.reloading = true;
    this.jobService.getJob(this.jobId).subscribe(
      (job: Job) => {
        this.job = job;

        if (this.job.status === 'NO_WORKER') {
          this.hiddeAdvancedFunction = true;
        }
        this.reloading = false;
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.reloading = false;

        this.hiddeAdvancedFunction = true;

        this.randomWorkhorse = Math.floor(Math.random() * 9) + 1;
        this.toastrService.error(error.statusText + ': ' + error.error);
      }
    );
  }

  addTag(event) {
    const clone = this.job.tags.slice(0);
    clone.push(event.value);
    this.updateJob('Tags', 'tags', clone);
  }

  removeTag(event) {
    const clone = this.job.tags.slice(0);
    let found = false;
    for (let i = clone.length - 1; i >= 0; i--) {
      if (clone[i] === event) {
        clone.splice(i, 1);
        found = true;
      }
    }
    if (found) {
      this.updateJob('Tags', 'tags', clone);
    }
  }

  updateJob(name: string, attribute: string, newValue: any): boolean {
    const oldValue = this.job[attribute];
    if (oldValue === newValue) {
      return;
    }
    if (newValue === '') {
      newValue = null;
    }
    this.job[attribute] = newValue;
    this.jobService.updateJob(this.job).subscribe(
      (job: Job) => {
        this.job = job;
        this.toastrService.success(`Changed <strong>${name}</strong><br>from <i>${oldValue}</i><br>to <i>${newValue}</i>`);
      },
      () => {
        this.job[attribute] = oldValue;
        this.toastrService.error(`Could not change <strong>${name}</strong><br>from <i>${oldValue}</i><br>to <i>${newValue}</i>!`);
      }
    );
  }

  deleteJob() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = `Delete job '${this.job.name}' with all it's executions?`;
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.jobService.deleteJob(this.jobId).subscribe(
            () => {
              this.toastrService.success('Job deleted');
              this.router.navigate([`jobs`]);
            },
            error => {
              this.toastrService.error('Could not delete job: ' + error.message);
            }
          );
        }
      },
      () => {}
    );
  }

  activateJob() {
    this.jobService.activateJob(this.job.id).subscribe(
      (job: Job) => {
        this.job = job;
        this.toastrService.success(`Activated job <strong>${this.job.name}</strong>`);
      },
      () => {
        this.toastrService.error(`Could not activate job <strong>${this.job.name}</strong>`);
      }
    );
  }

  deactivateJob() {
    this.jobService.deactivateJob(this.job.id).subscribe(
      (job: Job) => {
        this.job = job;
        this.toastrService.success(`Deactivated job <strong>${this.job.name}</strong>`);
      },
      () => {
        this.toastrService.error(`Could not deactivate job <strong>${this.job.name}</strong>`);
      }
    );
  }

  createExecution() {
    const modalRef: NgbModalRef = this.modalService.open(CreateExecutionComponent, this.config);
    modalRef.componentInstance.job = this.job;
    modalRef.result.then(() => {}).catch(() => {});
  }

  triggerScheduledJobExecution() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = `Do you really want to create a scheduled execution of "'${this.job.name}'" ?`;
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.jobService.triggerScheduledExecutionCreation(this.job).subscribe(
            () => {
              this.toastrService.success('Scheduled job execution created');
            },
            (error: any) => {
              this.toastrService.error('Could not create scheduled job execution: ' + error.message);
            }
          );
        }
      },
      () => {}
    );
  }

  navigateBack() {
    this.location.back();
  }

  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastrService.info(val, 'Copied to clipboard:');
  }
}
