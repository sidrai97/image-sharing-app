import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-image',
  templateUrl: './create-image.component.html',
  styleUrls: ['./create-image.component.scss']
})
export class CreateImageComponent implements OnInit {

  title: string;
  selectedTag: any;
  tags: any;
  selectedFile: File;
  type: string;
  imageId: string;

  constructor(public dialogRef: MatDialogRef<CreateImageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService) { 
    this.type = data.type;
    this.tags = data.tags;
    if(this.type == 'update'){
      this.imageId = data.image.imageId;
      this.title = data.image.title;
      for(let tag of this.tags){
        if(tag.tagId == data.image.tagId){
          this.selectedTag = tag
        }
      }
    }
  }

  ngOnInit(): void {
  }

  addImage(){
    if(this.type == 'add' && this.title != undefined && this.selectedTag != undefined && this.selectedFile != undefined){
      this.api.createImage(this.selectedTag.tagId, this.title).subscribe(resp => {
        this.api.uploadFile(this.selectedFile, resp.signedURL).subscribe(resp2 => {
          console.log(resp)
          console.log(resp2)
          this.dialogRef.close({event: 'created'})
        })
      })
    }
    else if(this.type == 'update' && this.imageId != undefined && this.selectedTag != undefined && this.title != undefined){
      this.api.updateImage(this.imageId,this.selectedTag.tagId, this.title).subscribe(resp => {
        console.log(resp)
        this.dialogRef.close({event: 'updated'})
      })
    }
  }

  close(){
    this.dialogRef.close({event: 'close'})
  }

  browseFile(){
    let element: HTMLElement = document.querySelector('input[name="imageFile"]') as HTMLElement;
    element.click();
  }

  uploadFile(e){
    this.selectedFile = e.target.files[0]
    e.target.value = ''
  }
}
