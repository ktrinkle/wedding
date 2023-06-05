import { createReducer, on } from '@ngrx/store';
import { weddingPartyMemberDto } from 'src/app/data/data';
import { partyByAuthSuccess, savePartyMemberSuccess, removePartyMemberSuccess, rsvpListSuccess } from './wedding.actions';

export interface State {
  currentEmail: string,
  partyMembers: weddingPartyMemberDto[],
  rsvpList: weddingPartyMemberDto[]
}

export const initialState: State = {
  currentEmail: '',
  partyMembers: new Array<weddingPartyMemberDto>(),
  rsvpList: new Array<weddingPartyMemberDto>(),
};


export const weddingReducer = createReducer(
  initialState,

  on(partyByAuthSuccess, (state, { partyMembers }) => ({
    ...state,
    partyMembers: partyMembers
  })),

  on(savePartyMemberSuccess, (state, { partyMembers }) => ({
    ...state,
    partyMembers: partyMembers
  })),

  on(removePartyMemberSuccess, (state, { partyMembers }) => ({
    ...state,
    partyMembers: partyMembers
  })),

  on(rsvpListSuccess, (state, { rsvpList }) => ({
    ...state,
    rsvpList: rsvpList
  }))

);
