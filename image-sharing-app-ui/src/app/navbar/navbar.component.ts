import { Component, OnInit , Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService, @Inject(DOCUMENT) public document: Document) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails(){
    this.auth.isAuthenticated$.subscribe(async resp => {
      if(!resp){
        return
      }
      this.auth.idTokenClaims$.subscribe(user => {
        let token = 'Bearer ' + user.__raw
        localStorage.setItem('token', 'Bearer ' + user.__raw)
        console.log(token)
        console.log(user)
      })      
    })
  }
}
