import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getImages(): Observable<any> {
    return this.http.get(environment.api + 'images')
  }

  getImagesByUserId(): Observable<any> {
    return this.http.get(environment.api + 'images/userId')
  }

  getImagesByTagId(tagId: string): Observable<any> {
    return this.http.get(environment.api + 'images/tagId/' + tagId)
  }

  getImagesByUserTag(tagId: string): Observable<any> {
    return this.http.get(environment.api + 'images/userId/tagId/' + tagId)
  }

  createImage(tagId: string, title: string): Observable<any>{
    return this.http.post(environment.api + 'images', {title,tagId})
  }

  deleteImage(imageId: string): Observable<any>{
    return this.http.delete(environment.api + 'images/' + imageId)
  }

  updateImage(imageId: string, tagId: string, title: string): Observable<any>{
    return this.http.patch(environment.api + 'images/' + imageId, {tagId,title})
  }

  getTags(): Observable<any> {
    return this.http.get(environment.api + 'tags')
  }

  getTagsByUserId(): Observable<any> {
    return this.http.get(environment.api + 'tags/userId')
  }

  createTag(tagName: string): Observable<any>{
    return this.http.post(environment.api + 'tags', {tagName})
  }

  uploadFile(file: File, url: string): Observable<any>{
    return this.http.put(url, file, {
      headers: {
        "Content-Type": file.type
      }
    })
  }
}
