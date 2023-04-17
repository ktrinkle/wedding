import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public authService: AuthService) { }

  loggedIn = this.authService.isLoggedIn().subscribe();

  title = 'Wedding';
}
