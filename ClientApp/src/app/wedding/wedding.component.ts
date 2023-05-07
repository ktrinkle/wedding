import { Component } from '@angular/core';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';

const DragConfig = {
  zIndex: 100
};

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.css'],
  providers: [{
    provide: CDK_DRAG_CONFIG, useValue: DragConfig
  }]
})

export class WeddingComponent {

  windowVisible: boolean = true;

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }
}
