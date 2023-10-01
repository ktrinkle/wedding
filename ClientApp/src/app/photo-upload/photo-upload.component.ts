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
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public dataService: DataService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private store: Store
    ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      // console.log(params);
      var photoKeyString = params.get("deeplink");
      // console.log(photoKeyString);
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
