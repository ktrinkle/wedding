import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  time: Date = new Date();
  trashEnabled: boolean = true;

  constructor(private authService: AuthService, private eventService: EventService) {
    this.getCurrentDate();
  }

  isExpanded = false;
  userLoggedIn = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.processLogout();
  }

  getCurrentDate() {
    setInterval(() => {
    this.time = new Date(); //set time variable with current date
   }, 1000); // set it every one seconds}
  }

  emptyTrash() {
    this.eventService.emptyTrashEmit();
    this.trashEnabled = false;
  }

}
