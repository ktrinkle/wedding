import { Component } from '@angular/core';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import { MediaMatcher } from '@angular/cdk/layout';
import { weddingPartyMemberDto } from 'src/app/data/data';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectRsvpList } from 'src/app/store';
import { rsvpList } from 'src/app/store/wedding.actions';


@Component({
  selector: 'app-rsvplist',
  templateUrl: './rsvplist.component.html',
  styleUrls: ['./rsvplist.component.scss']
})
export class RsvplistComponent {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // we play with this because we have 3 states.
  filterStatus?: boolean = true;
  windowVisible: boolean = true;
  active = 1;

  public rsvpList: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();
  public filteredRsvpList: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();

  constructor (private readonly mediaMatcher: MediaMatcher, private store: Store) {}

  ngOnInit() {
    this.updateRsvpList();
    this.filterRsvpList(true);
    this.store.dispatch(rsvpList());
  }

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  updateRsvpList() {
    this.store.select(selectRsvpList).pipe(takeUntil(this.destroy$)).subscribe(rsvpList => {
      this.rsvpList = rsvpList;
    });
  }

  filterRsvpList(filterState?: boolean) {
    this.filterStatus = filterState;
    console.log(filterState);
    this.filteredRsvpList = this.rsvpList.filter(x => x.rsvpYes == filterState);
    console.log(this.filteredRsvpList.length);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
