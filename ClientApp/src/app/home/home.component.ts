import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { frontLogin } from 'src/app/data/data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent{

  public loginForm: UntypedFormGroup = new UntypedFormGroup({
    emailAddress: new UntypedFormControl('', [Validators.pattern('[0-9]*')]),
    password: new UntypedFormControl()
  });

  constructor(private authService: AuthService) { }

  submitLogin(): void {
    if (this.loginForm.value.emailAddress != '' && this.loginForm.value.password != '')
    {
      var loginSubmit: frontLogin = {
        emailAddress: this.loginForm.value.userId,
        password: this.loginForm.value.password
      }

      // this.authService.processLoginAdmin(loginSubmit);
    }
  }
}
