import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'schedule-info',
  templateUrl: './schedule-info.component.html',
  styleUrls: ['./schedule-info.component.css']
})
export class ScheduleInfoComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
