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

export const removePartyMember = createAction(
  '[Wedding] RemovePartyMember',
  props<{ partyMember: weddingPartyMemberDto }>()
);

export const removePartyMemberSuccess = createAction(
  '[Wedding] RemovePartyMemberSuccess',
  props<{ partyMembers: weddingPartyMemberDto[] }>()
);

export const rsvpList = createAction(
  '[Wedding] RsvpList',
);

export const rsvpListSuccess = createAction(
  '[Wedding] RsvpListSuccess',
  props<{ rsvpList: weddingPartyMemberDto[] }>()
);



