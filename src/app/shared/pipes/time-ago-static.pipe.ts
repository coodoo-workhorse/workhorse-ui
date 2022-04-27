import { Pipe, PipeTransform } from '@angular/core';

/**
 * Copied the string part of time-ago-pipe to avoid the expensive
 * recalculation...
 */
@Pipe({ name: 'timeAgoStatic' })
export class TimeAgoStaticPipe implements PipeTransform {
  transform(value: Date): string {
    const date = new Date(value);
    // const dUtc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const now = new Date();
    // const seconds = Math.round((now.getTime() - dUtc.getTime()) / 1000);
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (Number.isNaN(seconds)) {
      return '';
    }
    if (seconds >= 0) {
      if (seconds <= 45) {
        return 'a few seconds ago';
      }
      if (seconds <= 90) {
        return 'a minute ago';
      }
      const minutes = Math.round(seconds / 60);
      if (minutes <= 45) {
        return minutes + ' minutes ago';
      }
      if (minutes <= 90) {
        return 'an hour ago';
      }
      const hours = Math.round(minutes / 60);
      if (hours <= 22) {
        return hours + ' hours ago';
      }
      if (hours <= 36) {
        return 'a day ago';
      }
      const days = Math.round(hours / 24);
      if (days <= 25) {
        return days + ' days ago';
      }
      if (days <= 45) {
        return 'a month ago';
      }
      const months = Math.round(days / 30.416);
      if (days <= 345) {
        return months + ' months ago';
      }
      if (days <= 545) {
        return 'a year ago';
      }
      const years = Math.round(days / 365);
      // (days > 545)
      return years + ' years ago';
    } else {
      if (seconds >= -45) {
        return 'in a few seconds';
      }
      if (seconds >= -90) {
        return 'in a minute';
      }
      const minutes = Math.round(seconds / 60);
      if (minutes >= -45) {
        return 'in ' + Math.abs(minutes) + ' minutes';
      }
      if (minutes >= -90) {
        return 'in an hour';
      }
      const hours = Math.round(minutes / 60);
      if (hours >= -22) {
        return 'in ' + Math.abs(hours) + ' hours';
      }
      if (hours >= -36) {
        return 'in a day';
      }
      const days = Math.round(hours / 24);
      if (days >= -25) {
        return 'in ' + Math.abs(days) + ' days';
      }
      if (days >= -45) {
        return 'in a month';
      }
      const months = Math.round(days / 30.416);
      if (days >= -345) {
        return 'in ' + Math.abs(months) + ' months';
      }
      if (days >= -545) {
        return 'in a year';
      }
      const years = Math.round(days / 365);
      // (days > 545)
      return 'in ' + Math.abs(years) + ' years or so';
    }
  }
}
