import { createReducer, on } from '@ngrx/store';
import { weddingPartyGiftDto, weddingPartyMemberDto } from 'src/app/data/data';
import { partyByAuthSuccess, savePartyMemberSuccess, removePartyMemberSuccess, rsvpListSuccess, giftListSuccess, saveGiftSuccess } from './wedding.actions';

export interface State {
  currentEmail: string,
  partyMembers: weddingPartyMemberDto[],
  rsvpList: weddingPartyMemberDto[],
  giftList: weddingPartyGiftDto[]
}

export const initialState: State = {
  currentEmail: '',
  partyMembers: new Array<weddingPartyMemberDto>(),
  rsvpList: new Array<weddingPartyMemberDto>(),
  giftList: new Array<weddingPartyGiftDto>()
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
  })),

  on(giftListSuccess, (state, { giftList }) => ({
    ...state,
    giftList: giftList
  })),

  on(saveGiftSuccess, (state, { partyGifts }) => ({
    ...state,
    giftList: partyGifts
  }))

);
