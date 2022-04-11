import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Basic Modal mit HTML-fähigem Content und zwei Buttons "Abbrechen" und default "Ja"
 * Nur der "Ja"-Button liefert beim Schließen ein result, worauf subsribed werden kann.
 */
@Component({
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  content: string;
  confirmText = 'Yes';
  declineText = 'No';
  closeMessage = 'modal_submitted';

  promptAvailable = false;
  promptText = '';

  constructor(public modal: NgbActiveModal) { }

  close() {
    this.modal.close(this.promptText || this.closeMessage);
  }
}
