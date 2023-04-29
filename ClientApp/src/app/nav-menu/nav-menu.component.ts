import { AfterContentInit, Component, ContentChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DropdownDirective } from './dropdown.directive';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {

  time: Date = new Date();

  constructor(private authService: AuthService, private renderer: Renderer2) {
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

}
