import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Scroll } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkMenuModule } from '@angular/cdk/menu';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { OfficiantComponent } from './wedding/officiant/officiant.component';
import { RsvpComponent } from './wedding/rsvp/rsvp.component';
import { VenueComponent } from './wedding/venue/venue.component';
import { GiftsComponent } from './wedding/gifts/gifts.component';
import { WeddingComponent } from './wedding/wedding.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../guards/auth.guard';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { JwtModule } from "@auth0/angular-jwt";
import { WeddingEffects } from './store/wedding.effects';
import { metaReducers, reducers } from './store';
import { DropdownDirective } from './nav-menu/dropdown.directive';
import { AboutComponent } from './about/about.component';

import { HttperrorInterceptor } from './services/httperror.interceptor';
import { RsvplistComponent } from './admin/rsvplist/rsvplist.component';
import { GiftListComponent } from './admin/gifts/giftlist.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from 'src/guards/admin.guard';
import { PhotoGuard } from 'src/guards/photo.guard';
import { RsvpDrinkPipe } from './services/rsvp-drink.pipe';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { PhotosComponent } from './wedding/photos/photos.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    OfficiantComponent,
    RsvpComponent,
    VenueComponent,
    GiftsComponent,
    WeddingComponent,
    DropdownDirective,
    AboutComponent,
    RsvplistComponent,
    AdminComponent,
    GiftListComponent,
    RsvpDrinkPipe,
    PhotosComponent,
    PhotoUploadComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'wedding', component: WeddingComponent, canActivate: [AuthGuard] },
      { path: 'wedding/officiant', component: OfficiantComponent, canActivate: [AuthGuard] },
      { path: 'wedding/rsvp', component: RsvpComponent, canActivate: [AuthGuard] },
      { path: 'wedding/venue', component: VenueComponent, canActivate: [AuthGuard] },
      { path: 'wedding/gifts', component: GiftsComponent, canActivate: [AuthGuard] },
      { path: 'wedding/photos', component: PhotosComponent, canActivate: [AuthGuard, PhotoGuard]},
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard]},
      { path: 'admin/rsvplist', component: RsvplistComponent, canActivate: [AuthGuard, AdminGuard]},
      { path: 'admin/giftlist', component: GiftListComponent, canActivate: [AuthGuard, AdminGuard]},
      { path: 'photos/:deeplink', component: PhotoUploadComponent }
    ]),
    NgbModule,
    DragDropModule,
    ScrollingModule,
    CdkMenuModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot(WeddingEffects),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost", "kevinandaustin.com", "localhost:7096"],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttperrorInterceptor, multi: true },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
