import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { photoListDto } from 'src/app/data/data';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();
  file!: File; // Variable to store file
  files!: File[]; // array of files for future use
  message: string | undefined;
  progress: number | undefined;
  galleryDisplay: boolean = false;
  photoList: photoListDto[] | undefined;

  constructor (private dataService: DataService) { }

  windowVisible: boolean = true;
  galleryExpanded: boolean = true;

  ngOnInit(): void {
    this.getThumbsFromApi();
  }

  toggleCollapse(winType: string): void {
    if (winType == "gallery")
    {
      this.galleryDisplay = !this.galleryDisplay;
    }
    if (winType == "main")
    {
      this.windowVisible = !this.windowVisible;
    }
  }

  async onUpload(): Promise<void> {
    // basic filter, not 100% reliable

    for(let index = 0; index < this.files.length; index++)
    {
      var newfile = this.files[index];
      console.log(newfile);
      if (newfile.type.startsWith("image/"))
      {
        // Create form data
        const formData = new FormData();
        formData.append("file", newfile, newfile.name);

        this.dataService.savePhotoFile(formData).subscribe(x => {
          console.log(x);
          this.message = "Your file has been uploaded!";
        });
      }
    };

    this.getThumbsFromApi();
  }

  getThumbsFromApi()
  {
    // clean old results
    this.photoList = undefined;

    this.dataService.getThumbnails().subscribe(pr =>
      this.photoList = pr
    );
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    this.files = event.target.files;
    console.log(this.files);
    this.message = "";
  }

  showGallery(photoIndex: number) {
    this.galleryDisplay = true;
    console.log('showGallery' + this.galleryDisplay + ' ' + photoIndex);
    // future use, filter to get the gallery pic and set as active in win
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
