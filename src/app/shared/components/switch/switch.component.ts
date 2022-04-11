import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() label = 'switch';
  @Input() value = false;
  @Input() textOn: string;
  @Input() textOff: string;

  onChange: any = (_: any) => { };
  onTouched: any = () => { };

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: boolean) {
    if (value) {
      this.value = value;
    }
  }

  switch() {
    this.value = !this.value;
    this.onChange(this.value);
  }
}
