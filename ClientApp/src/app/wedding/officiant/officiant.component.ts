import { Component } from '@angular/core';

@Component({
  selector: 'app-officiant',
  templateUrl: './officiant.component.html',
  styleUrls: ['./officiant.component.css']
})
export class OfficiantComponent {

  windowVisible: boolean = true;

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }
}
