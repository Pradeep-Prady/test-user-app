import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeToPlain',
})
export class SnakeToPlainPipe implements PipeTransform {
  transform(data: any): unknown {
    if (typeof data == 'string') {
      return data.split('_').join(' ');
    }
    return data;
  }
}
