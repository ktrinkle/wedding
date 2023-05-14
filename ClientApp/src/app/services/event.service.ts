import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  emptyTrash = new EventEmitter();
  subsVar: Subscription = new Subscription;

  constructor() { }

  emptyTrashEmit() {
    console.log('trash emptied');
    this.emptyTrash.emit();
  }
}