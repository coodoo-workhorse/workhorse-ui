import { Component, Input } from '@angular/core';

@Component({
  selector: 'job-tags',
  templateUrl: './job-tags.component.html',
  styleUrls: ['./job-tags.component.css']
})
export class JobTagsComponent {
  @Input() tags: string[];

  stringToColour(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      // tslint:disable-next-line
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      // tslint:disable-next-line
      const value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

  invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
    }
    // invert color components
    // pad each with zeros and return
    return '#' + this.padZero((255 - r).toString(16)) +
      this.padZero((255 - g).toString(16)) +
      this.padZero((255 - b).toString(16));
  }
  private padZero(str) {
    const zeros = new Array(2).join('0');
    return (zeros + str).slice(-2);
  }
}
