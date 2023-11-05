import { Component, OnDestroy, OnInit } from '@angular/core';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import { MediaMatcher } from '@angular/cdk/layout';
import { weddingPartyMemberDto } from 'src/app/data/data';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectRsvpList } from 'src/app/store';
import { rsvpList, savePartyMember } from 'src/app/store/wedding.actions';
import { Guid } from 'typescript-guid';


@Component({
  selector: 'app-rsvplist',
  templateUrl: './rsvplist.component.html',
  styleUrls: ['./rsvplist.component.scss']
})
export class RsvplistComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // we play with this because we have 3 states.
  filterStatus?: boolean = true;
  windowVisible: boolean = true;
  active = 1;

  public rsvpList: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();
  public filteredRsvpList: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();

  constructor (private readonly mediaMatcher: MediaMatcher, private store: Store) {
    this.store.dispatch(rsvpList());
    this.updateRsvpList();
  }

  ngOnInit() {
    this.filterRsvpList(true);
  }

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  updateRsvpList() {
    this.store.select(selectRsvpList).pipe(takeUntil(this.destroy$)).subscribe(rsvpList => {
      this.rsvpList = rsvpList;
    });
  }

  changeStatus(partyInfo: weddingPartyMemberDto, rsvpStatus: boolean)
  {
    var newParty:weddingPartyMemberDto = {
      rsvpYes: rsvpStatus,
      groupId: partyInfo.groupId,
      groupMemberId: partyInfo.groupMemberId,
      groupMemberName: partyInfo.groupMemberName,
      rsvpComment: partyInfo.rsvpComment
    };

    // console.log(newParty);

    this.store.dispatch(savePartyMember({ partyMember: newParty }));
    this.store.dispatch(rsvpList());
    this.updateRsvpList();
  }

  filterRsvpList(filterState?: boolean) {
    this.filterStatus = filterState;
    this.filteredRsvpList = this.rsvpList.filter(x => x.rsvpYes == filterState);
    // console.log(this.filteredRsvpList);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
