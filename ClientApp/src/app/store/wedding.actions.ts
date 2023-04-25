import { createAction, props } from '@ngrx/store';
import { weddingPartyDto, weddingPartyMemberDto, bearerDto } from '../data/data';

export const partyByAuth = createAction(
  '[Wedding] GetParty',
);

export const partyByAuthSuccess = createAction(
  '[Wedding] GetPartySuccess',
  props<{ partyMembers: weddingPartyMemberDto[] }>()
);

// export const round1AllTeams = createAction(
//   '[Round1] GetAllTeams',
//   props<{ yEvent: string }>()
// );

// export const round1AllTeamsSuccess = createAction(
//   '[Round1] LoadAllTeams',
//   props<{ allTeams: introDto[] }>()
// );



