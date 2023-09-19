import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { photoListDto } from 'src/app/data/data';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Guid } from 'typescript-guid';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();
  files!: File[]; // array of files for future use
  message: string | undefined;
  progress: number | undefined;
  galleryDisplay: boolean = false;
  images!: any[]; // for the array of images in the gallery
  storageUri: string = "https://photo.kevinandaustin.com/";
  sasKey: string = "";

  constructor (private dataService: DataService, private sanitizer: DomSanitizer, private authService: AuthService) { }

  windowVisible: boolean = true;
  galleryExpanded: boolean = true;

  private photoListSubject : BehaviorSubject<photoListDto[]> | undefined;
  public photoList$ : Observable<photoListDto[]> | undefined;

  ngOnInit(): void {
    this.photoListSubject = new BehaviorSubject<photoListDto[]>([]);

    this.photoList$ = this.photoListSubject.asObservable();

    this.sasKey = this.authService.getSasToken();

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
    this.dataService.getThumbnails().subscribe(pr => {
      this.photoListSubject!.next(pr)
    });
  }

  onChange(event: any) {
    this.files = event.target.files;
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
