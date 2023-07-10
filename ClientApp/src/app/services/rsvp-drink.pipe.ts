import { Pipe, PipeTransform } from '@angular/core';
import { RsvpDrinkType } from '../data/data';

@Pipe({
  name: 'rsvpDrink'
})
export class RsvpDrinkPipe implements PipeTransform {

  transform(value: RsvpDrinkType | undefined, ): any {
    if (value == undefined || value == null)
    {
      return '';
    }

    return RsvpDrinkType[value];
  }

}
