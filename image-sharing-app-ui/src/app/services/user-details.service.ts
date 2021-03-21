import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  
  private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  getIsAuthenticated = this._isAuthenticated.asObservable();
  setIsAuthenticated(value: boolean){
    this._isAuthenticated.next(value);
  }

  private _token: string;
  private _userName: string;
  private _picture: string;
  private _sub: string;

  constructor() { 
  }

  get token(){
    return this._token
  }

  set token(value: string){
    this._token = value
  }

  get userName(){
    return this._userName
  }

  set userName(value: string){
    this._userName = value
  }

  get picture(){
    return this._picture
  }

  set picture(value: string){
    this._picture = value
  }

  get sub(){
    return this._sub
  }

  set sub(value: string){
    this._sub = value;
  }
}
