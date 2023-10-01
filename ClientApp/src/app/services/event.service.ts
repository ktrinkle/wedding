import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  emptyTrash = new EventEmitter();
  loginEmitter = new EventEmitter();
  photoUploadEmitter = new EventEmitter();
  subsVar: Subscription = new Subscription;

  constructor() { }

  emptyTrashEmit() {
    this.emptyTrash.emit();
  }

  loginStartEmit() {
    this.loginEmitter.emit('start');
  }

  loginEndEmit() {
    this.loginEmitter.emit('end');
  }

  loginFailEmit() {
    this.loginEmitter.emit('fail');
  }

  photoUploadSuccessEmit() {
    this.photoUploadEmitter.emit();
  }
}
