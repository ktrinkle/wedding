import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { frontLogin } from 'src/app/data/data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  public loginError: boolean = false;

  public loginForm: UntypedFormGroup = new UntypedFormGroup({
    emailAddress: new UntypedFormControl('', [Validators.email]),
    password: new UntypedFormControl()
  });

  windowVisible: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

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
      if (loginStatus == 1)
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
}
