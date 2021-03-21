import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss']
})
export class CreateTagComponent implements OnInit {

  tagName: string;

  constructor(public dialogRef: MatDialogRef<CreateTagComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public api: ApiService) { }

  ngOnInit(): void {
  }

  createTag(){
    if(!this.tagName){
      return
    }
    this.api.createTag(this.tagName).subscribe(resp => {
      console.log(resp)
      this.dialogRef.close({event: 'created'})
    })
  }

  close(){
    this.dialogRef.close({event: 'close'})
  }
}
