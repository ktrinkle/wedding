import { Component } from '@angular/core';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  windowVisible: boolean = true;

  constructor (private readonly mediaMatcher: MediaMatcher) {}

  ngOnInit() {
  }

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  printWindow(): void {
    window.print();
  }
}
