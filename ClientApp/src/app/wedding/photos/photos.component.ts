import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();
  file!: File; // Variable to store file

  constructor (private formBuilder: UntypedFormBuilder) {
  }

  windowVisible: boolean = true;

  ngOnInit(): void {}

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  onUpload() {

    // Create form data
    // const formData = new FormData();

    // // Store form name as "file" with file data
    // formData.append("file", file, file.name);

    // return this.dataSer.post(this.baseApiUrl, formData);
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
