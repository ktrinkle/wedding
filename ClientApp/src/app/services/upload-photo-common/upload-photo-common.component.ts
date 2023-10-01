import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fileLoader } from 'src/app/data/data';
import { DataService } from '../data.service';
import { HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs';
import { EventService } from '../event.service';

@Component({
  selector: 'app-upload-photo-common',
  templateUrl: './upload-photo-common.component.html',
  styleUrls: ['./upload-photo-common.component.scss']
})
export class UploadPhotoCommonComponent {

  files!: File[]; // array of files for future use
  fileLoader!: fileLoader[];
  message: string | undefined;
  progress: number | undefined;

  constructor(private eventService: EventService, private dataService: DataService) {}

  async onUpload(): Promise<void> {
    // basic filter, not 100% reliable

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

              if (this.fileLoader[index].uploadPercent == 100)
              {
                console.log('calling refresh');
                this.eventService.photoUploadSuccessEmit();
              }
            }
          })).subscribe(q => {
            this.fileLoader[index].uploadMessage = "The file was successfully saved.";
            // this.eventService.photoUploadSuccessEmit();
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
      const newFile: fileLoader = {
        file: item,
        uploadPercent: 0,
        uploadMessage: '',
        uploadSuccess: undefined
        };
      this.fileLoader.push(newFile);
    });
  }
}
