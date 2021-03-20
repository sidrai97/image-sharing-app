import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from '@auth0/auth0-angular';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      redirectUri: environment.auth0CallbackURL,
      scope: 'openid'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
