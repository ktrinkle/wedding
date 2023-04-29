import { createAction, props } from '@ngrx/store';
import { weddingPartyDto, weddingPartyMemberDto, bearerDto } from '../data/data';

export const partyByAuth = createAction(
  '[Wedding] GetParty',
);

export const partyByAuthSuccess = createAction(
  '[Wedding] GetPartySuccess',
  props<{ partyMembers: weddingPartyMemberDto[] }>()
);

export const savePartyMember = createAction(
  '[Wedding] SavePartyMember',
  props<{ partyMember: weddingPartyMemberDto }>()
);

export const savePartyMemberSuccess = createAction(
  '[Wedding] SavePartyMemberSuccess',
  props<{ partyMembers: weddingPartyMemberDto[] }>()
);



