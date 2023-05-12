import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { partyByAuth, partyByAuthSuccess, savePartyMember, savePartyMemberSuccess, removePartyMember, removePartyMemberSuccess } from './wedding.actions';

@Injectable()
export class WeddingEffects {

  constructor(private actions$: Actions, private dataService: DataService) { }

  getPartyByAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyByAuth),
      switchMap(payload =>
        this.dataService.getPartyMembers().pipe(map(teams =>
          partyByAuthSuccess({ partyMembers: teams })
        ))
        )
    )
  );

  savePartyMember$ = createEffect(() =>
  this.actions$.pipe(
    ofType(savePartyMember),
    switchMap(payload =>
      this.dataService.saveRsvp(payload.partyMember).pipe(map(party =>
        savePartyMemberSuccess({ partyMembers: party })
      ))
      )
    )
  );

  removePartyMember$ = createEffect(() =>
  this.actions$.pipe(
    ofType(removePartyMember),
    switchMap(payload =>
      this.dataService.deleteMember(payload.partyMember).pipe(map(party =>
        removePartyMemberSuccess({ partyMembers: party })
      ))
      )
    )
  );
}
