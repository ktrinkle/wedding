import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';
import { photoListDto } from 'src/app/data/data';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();
  message: string | undefined;
  progress: number | undefined;
  galleryDisplay: boolean = false;
  images!: any[]; // for the array of images in the gallery
  storageUri: string = "https://photo.kevinandaustin.com/";
  sasKey: string = "";

  constructor (private dataService: DataService, private eventService: EventService,
    private authService: AuthService) { }

  windowVisible: boolean = true;
  galleryExpanded: boolean = true;
  activeSlide: string = "slide-0";

  private photoListSubject : BehaviorSubject<photoListDto[]> | undefined;
  public photoList$ : Observable<photoListDto[]> | undefined;

  ngOnInit(): void {
    this.photoListSubject = new BehaviorSubject<photoListDto[]>([]);

    this.photoList$ = this.photoListSubject.asObservable();

    this.sasKey = this.authService.getSasToken();

    this.eventService.emptyTrash.subscribe(() => {
      this.getThumbsFromApi();
    });

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

  getThumbsFromApi()
  {
    this.dataService.getThumbnails().pipe(takeUntil(this.destroy$)).subscribe(pr => {
      this.photoListSubject!.next(pr)
    });
  }

  showGallery(photoIndex: number) {
    this.activeSlide = "slide-" + photoIndex.toFixed(0).toString();
    this.galleryDisplay = true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
