import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoCommonComponent } from './upload-photo-common.component';

describe('UploadPhotoCommonComponent', () => {
  let component: UploadPhotoCommonComponent;
  let fixture: ComponentFixture<UploadPhotoCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPhotoCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPhotoCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
