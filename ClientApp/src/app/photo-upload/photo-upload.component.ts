import { Component, OnDestroy, OnInit } from '@angular/core';
import { Guid } from 'typescript-guid';
import { DataService } from '../services/data.service';
import { fileLoader } from '../data/data';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, catchError, takeUntil, tap } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit, OnDestroy {


  // injected from router
  public photoKey: Guid | undefined;
  public authenticated: boolean = false;
  public authenticateStatus: string = "Please wait for this page to be available.";
  windowVisible: boolean = true;
  files!: File[]; // array of files for future use
  fileLoader!: fileLoader[];
  message: string | undefined;
  progress: number | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store
    ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      console.log(params);
      var photoKeyString = params.get("deeplink");
      console.log(photoKeyString);
      this.photoKey = Guid.parse(photoKeyString ?? "");
      if (Guid.isGuid(photoKeyString ?? ""))
      {
        // fire loading cycle
        this.dataService.loginPhotoUpload(this.photoKey).pipe(takeUntil(this.destroy$)).subscribe({
          next: (al: any) => {
            if (al.bearerToken)
            {
              localStorage.setItem('access_token', al.bearerToken ?? "");
              this.authenticated = true;
              this.authenticateStatus = "Please upload your photos here!";
            }}});
      }
      console.log('photoKey');
      console.log(this.photoKey);
    });
  }

  async onUpload(): Promise<void> {
    // basic filter, not 100% reliable

    console.log(this.authenticated);
    if (!this.authenticated)
    {
      return;
    }

    console.log('start loop');
    console.log(this.fileLoader);
    for(let index = 0; index < this.fileLoader.length; index++)
    {
      var newfile = this.fileLoader[index].file;
      console.log(newfile.type);
      if (newfile.type.startsWith("image/"))
      {
        // Create form data
        const formData = new FormData();
        formData.append("file", newfile, newfile.name);

        this.dataService.savePhotoFile(formData).pipe(
          tap((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.fileLoader[index].uploadPercent =
                Math.round(100 * (event.loaded / event.total));
            }
          })).subscribe(q => {
            this.fileLoader[index].uploadMessage = "The file was successfully saved."
          });
      }
    };
  }

  onChange(event: any) {
    this.files = event.target.files;
    this.buildFileList(this.files);
    this.message = "";
  }

  buildFileList(fileList: File[]) : void {
    this.fileLoader = new Array();
    Array.from(fileList).forEach((item: File) => {
      console.log(item);
      const newFile: fileLoader = {
        file: item,
        uploadPercent: 0,
        uploadMessage: '',
        uploadSuccess: undefined
        };
      console.log(newFile);
      // never triggers this
      this.fileLoader.push(newFile);
      console.log(this.fileLoader);
    });
    console.log(this.fileLoader);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
