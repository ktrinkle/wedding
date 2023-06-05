import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from './services/event.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoggingService } from './services/logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, public eventService: EventService,
    private deviceService: DeviceDetectorService, private loggingService: LoggingService) { }

  loggedIn = this.authService.isLoggedIn();
  oscarActive: boolean = false;
  trashfull: boolean = true;

  public bootStatus: boolean = false;
  bootSound = new Audio('../../../assets/snd/boot.mp3');
  trashSound = new Audio('../../../assets/snd/trash1.mp3');

  title = 'Wedding';

  ngOnInit(): void {
    this.bootSound.load();
    this.trashSound.load();

    this.eventService.emptyTrash.subscribe(() => {
      this.emptyTrash();
    });

    if (this.deviceService.isMobile())
    {
      this.bootStatus = true;
    }
  }

  changeBoot(): void {
    this.bootSound.currentTime = 0;
    this.bootSound.play();
    this.bootStatus = true;
  }

  public emptyTrash(): void {
    this.trashSound.currentTime = 0;
    this.trashSound.play();
    this.oscarActive = true;
    timer(3800).subscribe(x => {
      this.oscarActive = false;
      this.trashfull = false;
    })
  }

}
