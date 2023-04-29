import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { weddingPartyMemberDto } from 'src/app/data/data';
import { selectPartyMembers } from 'src/app/store';
import { partyByAuth, savePartyMember } from 'src/app/store/wedding.actions';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit{

  destroy$: Subject<boolean> = new Subject<boolean>();
  removeFlag: boolean = false;

  public weddingPartyMembers: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();

  public weddingArray: UntypedFormGroup = new UntypedFormGroup(
    {
      partyMembers: new UntypedFormArray([])
    },
    {
      updateOn: "blur"
    });

  constructor (private store: Store, private formBuilder: UntypedFormBuilder) {
    this.store.dispatch(partyByAuth());
  }

  ngOnInit(): void {

    this.store.select(selectPartyMembers).pipe(takeUntil(this.destroy$)).subscribe(weddingParty => {
      this.weddingPartyMembers = weddingParty;

      const mArray = this.formBuilder.array([]);
      for (let member of this.weddingPartyMembers) {
        console.log(member);
        mArray.push(
          this.formBuilder.group({
            groupMemberId: new UntypedFormControl(member.groupMemberId),
            groupMemberName: new UntypedFormControl(member.groupMemberName),
            rsvpComment: new UntypedFormControl(member.rsvpComment),
            rsvpYes: new UntypedFormControl(member.rsvpYes)
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
    console.log(arrayLength);
    var newGroupMemberId = this.partyMembers.at(arrayLength-1).get('groupMemberId')?.value ?? 0;
    console.log(newGroupMemberId);

    var newGroup = this.formBuilder.group({
      groupMemberId: new UntypedFormControl(),
      groupMemberName: new UntypedFormControl(),
      rsvpComment: new UntypedFormControl(),
      rsvpYes: new UntypedFormControl()
    });

    this.partyMembers.push(newGroup);
  }

  removePartyMember(i: number): void {
    // for use when we rebuild the database
    this.removeFlag = true;

    // finally remove from the array
    this.partyMembers.removeAt(i);
  }


  saveRsvp(i: number) {
    //let newParty = new Array(this.partyMembers.length)
    //  .map((v, index) => this.partyMembers.at(index).value as weddingPartyMemberDto);

    var newParty = this.partyMembers.at(i).value as weddingPartyMemberDto;
    newParty.groupMemberId = i + 1;
    console.log(newParty);

    this.store.dispatch(savePartyMember({ partyMember: newParty }));

  }

  private buildPartyChange(i: number): weddingPartyMemberDto
  {
    var partyChange: weddingPartyMemberDto = {
      groupMemberId: this.partyMembers.at(i).get('groupMemberId')?.value,
      groupMemberName: this.partyMembers.at(i).get('groupMemberName')?.value,
      rsvpYes: this.partyMembers.at(i).get('rsvpYes')?.value,
      rsvpComment: this.partyMembers.at(i).get('rsvpComment')?.value
    };

    return partyChange;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

