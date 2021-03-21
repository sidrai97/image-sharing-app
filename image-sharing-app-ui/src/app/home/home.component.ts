import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateImageComponent } from '../create-image/create-image.component';
import { CreateTagComponent } from '../create-tag/create-tag.component';
import { ApiService } from '../services/api.service';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isAuthenticated: boolean = false;
  images: any;
  tags: any;
  chipColor = ['primary', 'accent', 'warn']
  userImagesOnly: boolean = false;

  constructor(public userDetails: UserDetailsService, private api: ApiService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userDetails.getIsAuthenticated.subscribe(value => {
      if (this.isAuthenticated != value) {
        this.isAuthenticated = value
        if (this.isAuthenticated) {
          this.initData();
        }
      }
    })
  }

  initData() {
    this.api.getTags().subscribe(resp => {
      this.tags = resp.items
      this.getImages()
    })
  }

  filterImagesByTag(tag: any) {
    if(this.userImagesOnly){
      this.api.getImagesByUserTag(tag.tagId).subscribe(resp => {
        this.images = resp.items
      })
    }
    else{
      this.api.getImagesByTagId(tag.tagId).subscribe(resp => {
        this.images = resp.items
      })
    }
  }

  filterImagesByUserId() {
    this.api.getImagesByUserId().subscribe(resp => {
      this.images = resp.items
    })
  }

  getTagNameFromTagId(tagId: string) {
    let tag = this.tags.filter(tag => tag.tagId == tagId)
    return tag[0].tagName
  }

  getAllImages() {
    this.api.getImages().subscribe(resp => {
      this.images = resp.items
    })
  }

  toggle(event: any) {
    this.userImagesOnly = event.checked
    this.getImages()
  }

  deleteImage(imageId: string) {
    this.api.deleteImage(imageId).subscribe(resp => {
      this.getImages()
    })
  }

  getImages() {
    if (this.userImagesOnly) {
      this.filterImagesByUserId()
    }
    else {
      this.getAllImages()
    }
  }

  updateImage(image: any) {
    const dialogRef = this.dialog.open(CreateImageComponent, {
      maxHeight: "100%",
      width: "400px",
      maxWidth: "100%",
      data: {
        type: 'update',
        tags: JSON.parse(JSON.stringify(this.tags)),
        image: JSON.parse(JSON.stringify(image))
      },
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'updated') {
        this.getImages()
      }
    });
  }

  createImage() {
    const dialogRef = this.dialog.open(CreateImageComponent, {
      maxHeight: "100%",
      width: "400px",
      maxWidth: "100%",
      data: {
        type: 'add',
        tags: JSON.parse(JSON.stringify(this.tags))
      },
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'created') {
        this.getImages()
      }
    });
  }

  createTag() {
    const dialogRef = this.dialog.open(CreateTagComponent, {
      maxHeight: "100%",
      width: "400px",
      maxWidth: "100%",
      data: {},
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'created') {
        this.initData()
      }
    });
  }
}
