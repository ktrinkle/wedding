import { Component, OnInit } from '@angular/core';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import { MediaMatcher } from '@angular/cdk/layout';

const DragConfig = {
  zIndex: 100
};

@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.scss'],
  providers: [{
    provide: CDK_DRAG_CONFIG, useValue: DragConfig
  }]
})

export class WeddingComponent implements OnInit {

  windowVisible: boolean = true;

  constructor (private readonly mediaMatcher: MediaMatcher) {}

  ngOnInit() {
    this.mediaMatcher.matchMedia('print').addEventListener("beforeprint", (event) => {
      console.log('printing');
    });
  }

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  printWindow(): void {
    window.print();
  }

}
