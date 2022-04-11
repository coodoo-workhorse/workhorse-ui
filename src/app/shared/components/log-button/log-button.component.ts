import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Log } from '../../../../services/log.model';
import { LogService } from '../../../../services/logs.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'log-button',
  templateUrl: './log-button.component.html',
  styleUrls: ['./log-button.component.css']
})
export class LogButtonComponent {
  @Input()
  jobId: number;

  @Output() newLog: EventEmitter<Log> = new EventEmitter<Log>();

  logging = false;

  constructor(private logService: LogService, private toastrService: ToastrService, private modalService: NgbModal) {}

  logMessage() {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
    modalRef.componentInstance.content = this.jobId ? 'Add log message on job' : 'Add log message';
    modalRef.componentInstance.promptAvailable = true;
    modalRef.result.then(
      message => {
        if (message) {
          this.logging = true;
          if (this.jobId) {
            this.logService.createLogMessageForJob(this.jobId, message).subscribe(
              log => {
                this.toastrService.success('Message on job logged: ' + message);
                this.logging = false;
                this.newLog.emit(log);
              },
              () => {
                this.toastrService.error('Failed to log message on job: ' + message);
                this.logging = false;
              }
            );
          } else {
            this.logService.createLogMessage(message).subscribe(
              log => {
                this.toastrService.success('Message logged: ' + message);
                this.logging = false;
                this.newLog.emit(log);
              },
              () => {
                this.toastrService.error('Failed to log message: ' + message);
                this.logging = false;
              }
            );
          }
        }
      },
      () => {}
    );
  }
}
