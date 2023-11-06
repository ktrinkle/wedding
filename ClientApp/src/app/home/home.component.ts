import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { frontLogin } from 'src/app/data/data';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  public loginError: boolean = false;
  public loginProcessing: boolean = false;

  public loginForm: UntypedFormGroup = new UntypedFormGroup({
    emailAddress: new UntypedFormControl('', [Validators.email]),
    password: new UntypedFormControl()
  });

  windowVisible: boolean = true;

  constructor(private authService: AuthService, private router: Router,
    private eventService: EventService) { }

  WEBSITE_READONLY = this.authService.siteReadOnly();

  ngOnInit(): void {
    this.eventService.loginEmitter.subscribe(ev => {
      this.updateLoginDisplay(ev);
    });
  }

  submitLogin(): void {
    this.loginError = false;

    var emailOk = this.loginForm.value.emailAddress != '' || this.WEBSITE_READONLY;

    if (emailOk && this.loginForm.value.password != '')
    {

      var loginSubmit: frontLogin = {
        emailAddress: this.loginForm.value.emailAddress,
        password: this.loginForm.value.password
      }
      var loginStatus = this.WEBSITE_READONLY ? this.authService.processLoginNoEmail(loginSubmit) : this.authService.processLoginEmail(loginSubmit);
      if (loginStatus == -1)
      {
        this.router.navigate(["/wedding"]);
      }
      else
      {
        this.loginError = true;
      }

    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  updateLoginDisplay(state: Event): void {
    switch (state.toString()) {
      case 'start':
        this.loginProcessing = true;
        console.log(this.loginProcessing);
        break;
      case 'fail':
        this.loginProcessing = false;
        this.loginError == true;
        break;
      default:
        this.loginProcessing = false;
        break;
    }
  }
}
