import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { weddingPartyMemberDto, RsvpDrinkMapping, RsvpDrinkType } from 'src/app/data/data';
import { selectPartyMembers } from 'src/app/store';
import { partyByAuth, removePartyMember, savePartyMember } from 'src/app/store/wedding.actions';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.scss']
})
export class RsvpComponent implements OnInit, OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();
  removeFlag: boolean = false;
  disableForm: boolean = (new Date() > new Date("2023-10-14"));

  public weddingPartyMembers: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();

  public weddingArray: UntypedFormGroup = new UntypedFormGroup(
    {
      partyMembers: new UntypedFormArray([])
    },
    {
      updateOn: "blur"
    });

  public rsvpDrinkMapping = RsvpDrinkMapping;

  public drinkTypes = Object.values(RsvpDrinkMapping);

  constructor (private store: Store, private formBuilder: UntypedFormBuilder) {
    this.store.dispatch(partyByAuth());
  }

  windowVisible: boolean = true;

  ngOnInit(): void {
    this.store.select(selectPartyMembers).pipe(takeUntil(this.destroy$)).subscribe(weddingParty => {
      this.weddingPartyMembers = weddingParty;

      const mArray = this.formBuilder.array([]);
      for (let member of this.weddingPartyMembers) {
        mArray.push(
          this.formBuilder.group({
            groupMemberId: new UntypedFormControl({value: member.groupMemberId, disabled: this.disableForm}),
            groupMemberName: new UntypedFormControl({value: member.groupMemberName, disabled: this.disableForm}),
            rsvpComment: new UntypedFormControl({value: member.rsvpComment, disabled: this.disableForm}),
            rsvpYes: new UntypedFormControl({value: member.rsvpYes, disabled: this.disableForm}),
            rsvpDrinkType: new UntypedFormControl({value: member.rsvpDrinkType, disabled: this.disableForm})
          })
        );
      }

      // creates the entire form
      this.weddingArray = new UntypedFormGroup({
        partyMembers: mArray,
      });
    });
  }

  getPartyMembers(form: any) {
    return form?.get('partyMembers').controls;
  }

  get partyMembers() {
    return this.weddingArray.controls["partyMembers"] as UntypedFormArray;
  }

  addPartyMember(): void {
    var arrayLength = this.partyMembers.length;
    var newGroupMemberId = this.partyMembers.at(arrayLength-1).get('groupMemberId')?.value ?? 0;

    var newGroup = this.formBuilder.group({
      groupMemberId: new UntypedFormControl(),
      groupMemberName: new UntypedFormControl(),
      rsvpComment: new UntypedFormControl(),
      rsvpYes: new UntypedFormControl(),
      rsvpDrinkType: new UntypedFormControl()
    });

    this.partyMembers.push(newGroup);
  }

  removePartyMember(i: number): void {
    // for use when we rebuild the database
    this.removeFlag = true;
    var removeParty = this.partyMembers.at(i).value as weddingPartyMemberDto;

    this.store.dispatch(removePartyMember({ partyMember: removeParty }));

    // finally remove from the array
    this.partyMembers.removeAt(i);
  }


  saveRsvp(i: number) {
    //let newParty = new Array(this.partyMembers.length)
    //  .map((v, index) => this.partyMembers.at(index).value as weddingPartyMemberDto);

    var newParty = this.partyMembers.at(i).value as weddingPartyMemberDto;
    newParty.groupMemberId = i + 1;

    this.store.dispatch(savePartyMember({ partyMember: newParty }));

  }

  toggleCollapse(): void {
    this.windowVisible = !this.windowVisible;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

