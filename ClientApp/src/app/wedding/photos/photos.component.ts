import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();
  file!: File; // Variable to store file
  message: string | undefined;
  progress: number | undefined;

  constructor (private dataService: DataService) {
  }

  windowVisible: boolean = true;

  ngOnInit(): void {}

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  onUpload(): void {

    // basic filter, not 100% reliable

    if (this.file.type.startsWith("image/"))
    {
      // Create form data
      const formData = new FormData();
      formData.append("file", this.file, this.file.name);

      var rtnString: string;
      this.dataService.savePhotoFile(formData).subscribe(x => {
        console.log(x);
        this.message = "Your file has been uploaded!";
      });
    }

  }

  onChange(event: any) {
    this.file = event.target.files[0];
    this.message = "";
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
