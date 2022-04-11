import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'javaClassName'})
export class JavaClassNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return null;
    }
    const parts = value.split('.');
    if (parts.length > 0) {
      return parts[parts.length - 1];
    }
    return value;
  }
}
