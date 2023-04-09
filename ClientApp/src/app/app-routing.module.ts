import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeddingComponent } from './wedding/wedding.component';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './wedding/event/event.component';
import { GiftsComponent } from './wedding/gifts/gifts.component';
import { RsvpComponent } from './wedding/rsvp/rsvp.component';
import { VenueComponent } from './wedding/venue/venue.component';
import { AuthGuard } from 'src/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'wedding', component: WeddingComponent, canActivate: [AuthGuard] },
  { path: 'wedding/event', component: EventComponent, canActivate: [AuthGuard] },
  { path: 'wedding', component: WeddingComponent, canActivate: [AuthGuard] , children: [
    {
    path: 'event',
    component: EventComponent,
    canActivate: [AuthGuard]
    },{
      path: 'gifts',
      component: GiftsComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'rsvp',
      component: RsvpComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'venue',
      component: VenueComponent,
      canActivate: [AuthGuard]
    },
  ]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
