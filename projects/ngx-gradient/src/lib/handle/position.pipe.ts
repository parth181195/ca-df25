import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'position',
  standalone: true
})
export class PositionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
