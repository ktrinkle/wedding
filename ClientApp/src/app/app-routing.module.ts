import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeddingComponent } from './wedding/wedding.component';
import { HomeComponent } from './home/home.component';
import { OfficiantComponent } from './wedding/officiant/officiant.component';
import { GiftsComponent } from './wedding/gifts/gifts.component';
import { RsvpComponent } from './wedding/rsvp/rsvp.component';
import { VenueComponent } from './wedding/venue/venue.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { RsvplistComponent } from './admin/rsvplist/rsvplist.component';
import { GiftListComponent } from './admin/gifts/giftlist.component';
import { PhotosComponent } from './wedding/photos/photos.component';
import { PhotoUploadComponent } from './photo-upload/photo-upload.component';
import { PhotoGuard } from 'src/guards/photo.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'wedding', component: WeddingComponent, canActivate: [AuthGuard] , children: [
    {
    path: 'officiant',
    component: OfficiantComponent,
    canActivate: [AuthGuard]
    },{
      path: 'gifts',
      component: GiftsComponent,
      canActivate: [AuthGuard]
    }, {
    //   path: 'rsvp',
    //   component: RsvpComponent,
    //   canActivate: [AuthGuard]
    // }, {
      path: 'venue',
      component: VenueComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'photos',
      component: PhotosComponent,
      canActivate: [AuthGuard, PhotoGuard]
    }
  ]},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard], children: [
    // {
    //   path: 'rsvplist',
    //   component: RsvplistComponent,
    //   canActivate: [AuthGuard, AdminGuard]
    // },
    // {
    //   path: 'giftlist',
    //   component: GiftListComponent,
    //   canActivate: [AuthGuard, AdminGuard]
    // }
  ]},
  { path: 'photos/:deeplink', component: PhotoUploadComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
