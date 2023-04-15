import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './wedding/event/event.component';
import { RsvpComponent } from './wedding/rsvp/rsvp.component';
import { VenueComponent } from './wedding/venue/venue.component';
import { GiftsComponent } from './wedding/gifts/gifts.component';
import { WeddingComponent } from './wedding/wedding.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'src/guards/auth.guard';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    EventComponent,
    RsvpComponent,
    VenueComponent,
    GiftsComponent,
    WeddingComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'wedding', component: WeddingComponent, canActivate: [AuthGuard] },
      { path: 'wedding/event', component: EventComponent, canActivate: [AuthGuard] },
      { path: 'wedding/rsvp', component: RsvpComponent, canActivate: [AuthGuard] },
      { path: 'wedding/venue', component: VenueComponent, canActivate: [AuthGuard] },
      { path: 'wedding/gifts', component: GiftsComponent, canActivate: [AuthGuard] },
    ]),
    NgbModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
