import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { weddingPartyMemberDto } from 'src/app/data/data';
import { selectPartyMembers } from 'src/app/store';
import { partyByAuth } from 'src/app/store/wedding.actions';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit{

  destroy$: Subject<boolean> = new Subject<boolean>();

  public weddingPartyMembers: weddingPartyMemberDto[] = new Array<weddingPartyMemberDto>();

  public weddingArray: UntypedFormGroup = new UntypedFormGroup({
    partyMembers: new UntypedFormArray([])
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
            rsvp: new UntypedFormControl(member.rsvpYes)
          })
        );
      }

      console.log('marray');
      console.log(mArray);
      // creates the entire form
      this.weddingArray = new UntypedFormGroup({
        partyMembers: mArray,
      });
    });
  }

  getPartyMembers(form: any) {
    return form?.get('partyMembers').controls;
  }

}

