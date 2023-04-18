import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficiantComponent } from './officiant.component';

describe('EventComponent', () => {
  let component: OfficiantComponent;
  let fixture: ComponentFixture<OfficiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfficiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
