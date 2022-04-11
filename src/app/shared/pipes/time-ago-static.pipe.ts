import { Pipe, PipeTransform } from '@angular/core';

/**
 * Copied the string part of time-ago-pipe to avoid the expensive
 * recalculation...
 */
@Pipe({ name: 'timeAgoStatic' })
export class TimeAgoStaticPipe implements PipeTransform {
  transform(value: Date): string {
    const d = new Date(value);
    const dUtc = new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - dUtc.getTime()) / 1000));
    if (Number.isNaN(seconds)) {
      return '';
    }
    if (seconds <= 45) {
      return 'a few seconds ago';
    }
    if (seconds <= 90) {
      return 'a minute ago';
    }
    const minutes = Math.round(Math.abs(seconds / 60));
    if (minutes <= 45) {
      return minutes + ' minutes ago';
    }
    if (minutes <= 90) {
      return 'an hour ago';
    }
    const hours = Math.round(Math.abs(minutes / 60));
    if (hours <= 22) {
      return hours + ' hours ago';
    }
    if (hours <= 36) {
      return 'a day ago';
    }
    const days = Math.round(Math.abs(hours / 24));
    if (days <= 25) {
      return days + ' days ago';
    }
    if (days <= 45) {
      return 'a month ago';
    }
    const months = Math.round(Math.abs(days / 30.416));
    if (days <= 345) {
      return months + ' months ago';
    }
    if (days <= 545) {
      return 'a year ago';
    }
    const years = Math.round(Math.abs(days / 365));
    // (days > 545)
    return years + ' years ago';
  }
}
