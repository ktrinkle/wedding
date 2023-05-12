import { Component } from '@angular/core';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent {
  windowVisible: boolean = true;

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }
}
