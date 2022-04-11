import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.css']
})
export class SaveButtonComponent implements OnChanges {
  @Input() saveText = 'Save';
  @Input() loadText = 'Loading';
  @Input() loading = false;
  @Input() label: string;
  @Input() invalid = false;
  @Input() secondary = false;

  @Output() upload: EventEmitter<string> = new EventEmitter<string>();

  styleClasses: string[];
  btnText: string;

  constructor() {
    if (this.secondary) {
      this.styleClasses = ['btn', 'btn-secondary'];
    } else {
      this.styleClasses = ['btn', 'btn-primary'];
    }
    this.btnText = this.saveText;
  }

  onClick() {
    this.upload.emit(this.label);
  }

  onLoad() {
    if (this.loading === true) {
      this.btnText = this.loadText;
      this.styleClasses = ['btn', 'btn-secondary', 'onLoad'];
    } else {
      if (this.secondary) {
        this.styleClasses = ['btn', 'btn-secondary'];
      } else {
        this.styleClasses = ['btn', 'btn-primary'];
      }
      this.btnText = this.saveText;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading) {
      this.onLoad();
    }
  }
}
