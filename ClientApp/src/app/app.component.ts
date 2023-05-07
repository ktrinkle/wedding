import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) { }

  loggedIn = this.authService.isLoggedIn();

  public bootStatus: boolean = false;
  bootSound = new Audio('../../../assets/snd/boot.mp3');

  title = 'Wedding';

  ngOnInit(): void {
    this.bootSound.load();
  }

  changeBoot(): void {
    this.bootSound.currentTime = 0;
    this.bootSound.play();
    this.bootStatus = true;
  }

}
