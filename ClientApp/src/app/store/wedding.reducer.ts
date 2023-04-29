import { Action, createReducer, on } from '@ngrx/store';
import { bearerDto, weddingPartyMemberDto } from 'src/app/data/data';
import { partyByAuth, partyByAuthSuccess, savePartyMemberSuccess } from './wedding.actions';

export interface State {
  currentEmail: string,
  partyMembers: weddingPartyMemberDto[],
}

export const initialState: State = {
  currentEmail: '',
  partyMembers: new Array<weddingPartyMemberDto>(),
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
  }))


  // on(round1BigDisplaySuccess, (state, { allQuestions }) => ({
  //   ...state,
  //   bigDisplay: allQuestions
  // }))
);
