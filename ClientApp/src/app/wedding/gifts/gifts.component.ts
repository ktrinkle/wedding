import { Component } from '@angular/core';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent {

  windowVisible: boolean = true;

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }
}
