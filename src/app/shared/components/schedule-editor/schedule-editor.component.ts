import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleService } from '../../../../services/schedule.service';
import { ScheduleInfoComponent } from './schedule-info/schedule-info.component';

@Component({
  selector: 'schedule-editor',
  templateUrl: './schedule-editor.component.html',
  styleUrls: ['./schedule-editor.component.css']
})
export class ScheduleEditorComponent implements OnInit {
  @Input() schedule: string;
  scheduleDescription: string;

  constructor(private scheduleService: ScheduleService, private modalService: NgbModal) {}

  ngOnInit() {
    this.onChange();
  }

  onChange() {
    if (this.schedule === '') {
      this.schedule = null;
    }
    if (this.schedule) {
      // replace multiple spaces with a single space
      this.schedule = this.schedule.replace(/\s\s+/g, ' ').trim();
      const parts = this.schedule.split(' ');
      if (parts.length === 5) {
        this.schedule = '0 ' + this.schedule;
      }
      this.scheduleService.getDescription(this.schedule).subscribe(
        (data: string) => {
          this.scheduleDescription = data;
        },
        (error: any) => {
          this.scheduleDescription = error.error.text;
        }
      );
    } else {
      this.scheduleDescription = null;
    }
  }

  showScheduleInfo() {
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef: any = this.modalService.open(ScheduleInfoComponent, options);
    modalRef.result.then(() => {}).catch(() => {});
  }
}
