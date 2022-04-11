import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css'],
})
export class InlineEditComponent implements OnInit {
  @Input() data: number;
  @Input() type: string;
  @Input() maxlength: number;
  @Output() focusOut: EventEmitter<number> = new EventEmitter<number>();

  editMode = false;

  ngOnInit() {
    if (!this.type) {
      this.type = 'text';
    }
  }

  onFocusOut() {
    this.focusOut.emit(this.data);
  }
}
