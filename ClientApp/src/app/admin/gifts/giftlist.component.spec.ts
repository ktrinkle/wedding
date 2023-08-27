import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftListComponent } from './giftlist.component';

describe('GiftsComponent', () => {
  let component: GiftListComponent;
  let fixture: ComponentFixture<GiftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
