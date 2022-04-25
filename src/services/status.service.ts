import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../app/shared/components/modal/modal.component';
import { RefreshIntervalService } from './refresh-interval.service';
import { RefreshService } from './refresh.service';
import { WorkhorseService } from './workhorse.service';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  running: boolean;

  constructor(
    private workhorseService: WorkhorseService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private refreshIntervalService: RefreshIntervalService,
    private refreshService: RefreshService
  ) {
    this.getWorkhorseStatus();

    this.refreshIntervalService.refreshIntervalChanged$.subscribe(() => {
      this.getWorkhorseStatus();
    });

    this.refreshService.refreshChanged$.subscribe(() => {
      this.getWorkhorseStatus();
    });
  }

  getWorkhorseStatus() {
    this.workhorseService.isRunning().subscribe(
      (data: boolean) => {
        this.running = data;
      },
      (error: any) => {
        this.toastrService.info('Status Update failed' + error.message);
      }
    );
  }

  startWorkhorse() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = 'Are you sure you want to start Workhorse';
    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.workhorseService.startWorkhorse().subscribe(
            () => {
              this.toastrService.success('Workhorse started');
              this.running = true;
            },
            (error: any) => {
              this.toastrService.error('Could not start Workhorse: ' + error.message);
            }
          );
        }
      },
      () => {}
    );
  }

  stopWorkhorse() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = 'Are you sure you want to stop Workhorse';

    modalRef.result.then(
      closeResult => {
        if (closeResult) {
          this.workhorseService.stopWorkhorse().subscribe(
            () => {
              this.toastrService.success('Workhorse stopped');
              this.running = false;
            },
            (error: any) => {
              this.toastrService.error('Could not stop Workhorse: ' + error.message);
            }
          );
        }
      },
      () => {}
    );
  }

  isRunning() {
    return this.running;
  }
}
