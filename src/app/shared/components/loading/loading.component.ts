import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  preserveWhitespaces: true
})
export class LoadingComponent {
  @Input() loadingHorse = false;
}
