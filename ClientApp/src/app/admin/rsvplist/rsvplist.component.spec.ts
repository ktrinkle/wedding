import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvplistComponent } from './rsvplist.component';

describe('RsvplistComponent', () => {
  let component: RsvplistComponent;
  let fixture: ComponentFixture<RsvplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsvplistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsvplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
