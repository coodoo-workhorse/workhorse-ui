import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jobDuration' })
export class JobDurationPipe implements PipeTransform {
  // NON BREAKING SPACE
  NBS = '\u00A0';

  transform(millis: number, minUnit: string, round = false): string {
    if (millis >= 31563000000) {
      // y
      const y = Math.floor(millis / 31563000000);
      const d = Math.floor(millis / 86400000) % 365;
      if (d === 0 || round) {
        return `${y}y`;
      } else {
        return `${y}y${this.NBS}${d}d`;
      }
    }
    if (minUnit === 'd') {
      return `${Math.floor(millis / 86400000)}d`;
    }
    if (millis >= 86400000) {
      // h-m
      const d = Math.floor(millis / 86400000);
      const h = Math.floor(millis / 3600000) % 24;
      if (h === 0 || round) {
        return `${d}d`;
      } else {
        return `${d}d${this.NBS}${h}h`;
      }
    }
    if (minUnit === 'h') {
      return `${Math.floor(millis / 3600000)}h`;
    }
    if (millis >= 3600000) {
      // h-m
      const h = Math.floor(millis / 3600000);
      const min = Math.floor(millis / 60000) % 60;
      if (min === 0 || round) {
        return `${h}h`;
      } else {
        return `${h}h${this.NBS}${min}m`;
      }
    }
    if (minUnit === 'm') {
      return `${Math.floor(millis / 60000)}m`;
    }
    if (millis >= 60000) {
      // m-s
      const min = Math.floor(millis / 60000);
      const sec = Math.floor(millis / 1000) % 60;
      if (sec === 0 || round) {
        return `${min}m`;
      } else {
        return `${min}m${this.NBS}${sec}s`;
      }
    }
    if (minUnit === 's') {
      return `${Math.floor(millis / 1000)}s`;
    }
    if (millis >= 1000) {
      // s-ms
      const sec = Math.floor(millis / 1000);
      const ms = millis % 1000;
      if (ms === 0 || round) {
        return `${sec}s`;
      } else {
        return `${sec}s${this.NBS}${ms}ms`;
      }
    }
    // ms
    return `${millis}ms`;
  }
}
