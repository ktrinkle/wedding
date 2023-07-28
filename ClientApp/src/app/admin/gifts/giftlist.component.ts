import { Component, OnDestroy, OnInit } from '@angular/core';
import { weddingPartyGiftDto, weddingPartyMemberDto } from 'src/app/data/data';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectGiftList, selectRsvpList } from 'src/app/store';
import { giftList, rsvpList } from 'src/app/store/wedding.actions';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';


@Component({
  selector: 'giftlist',
  templateUrl: './giftlist.component.html',
  styleUrls: ['./giftlist.component.scss'],
})
export class GiftListComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  // Flip between the list and the edit/add
  windowVisible: boolean = true;
  tabValue: number = 1;
  active = 1;

  public giftList: weddingPartyGiftDto[] = new Array<weddingPartyGiftDto>();
  public rsvpList: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();
  private rsvpUpdateForm: FormGroup = new FormGroup(
  {
    groupId: new FormControl('', Validators.required),
    giftAmt: new FormControl('', Validators.pattern('[0-9\.].')),
    giftComment: new FormControl(''),
    giftDate: new FormControl('', Validators.required)
  });

  constructor (private store: Store) {}

  ngOnInit() {
    this.store.dispatch(giftList());
    this.store.dispatch(rsvpList());
    this.updateRsvpList();
    this.updateGiftList();
  }
  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  updateRsvpList() {
    this.store.select(selectRsvpList).pipe(takeUntil(this.destroy$)).subscribe(rsvpList => {
      this.rsvpList = rsvpList;
    });
  }

  updateGiftList() {
    this.store.select(selectGiftList).pipe(takeUntil(this.destroy$)).subscribe(giftList => {
      this.giftList = giftList;
    });
  }

  changeTab(tabValue: number)
  {
    this.tabValue = tabValue;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
