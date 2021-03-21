import { Component, OnInit , Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isAuthenticated: boolean = false;

  constructor(public auth: AuthService, @Inject(DOCUMENT) public document: Document, public userDetails: UserDetailsService) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.userDetails.getIsAuthenticated.subscribe(value => {
      if(this.isAuthenticated != value){
        this.isAuthenticated = value
      }
    })
  }

  async getUserDetails(){
    this.auth.isAuthenticated$.subscribe(async resp => {
      if(!resp){
        return
      }
      this.auth.idTokenClaims$.subscribe(user => {
        this.userDetails.token = 'Bearer ' + user.__raw;
        this.userDetails.userName = user.name
        this.userDetails.picture = user.picture
        this.userDetails.sub = user.sub;
        this.userDetails.setIsAuthenticated(resp);
        console.log(this.userDetails.token)
        console.log(user)
      })      
    })
  }
}
