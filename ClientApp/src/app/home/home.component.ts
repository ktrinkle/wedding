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

  ngOnInit(): void {
    this.eventService.loginEmitter.subscribe(ev => {
      this.updateLoginDisplay(ev);
    });
  }

  submitLogin(): void {
    this.loginError = false;

    if (this.loginForm.value.emailAddress != '' && this.loginForm.value.password != '')
    {

      var loginSubmit: frontLogin = {
        emailAddress: this.loginForm.value.emailAddress,
        password: this.loginForm.value.password
      }
      var loginStatus = this.authService.processLoginEmail(loginSubmit);
      console.log(loginStatus);
      if (loginStatus == -1)
      {
        this.router.navigate(["wedding"]);
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
    this.loginProcessing = state.toString() == 'start'? true : false;
  }
}
