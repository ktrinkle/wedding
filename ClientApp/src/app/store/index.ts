import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromWedding from './wedding.reducer';

export interface State {
  wedding: fromWedding.State,
}

export const reducers: ActionReducerMap<State> = {
  wedding: fromWedding.weddingReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectWeddingState = createFeatureSelector<fromWedding.State>('wedding');
export const selectPartyMembers = createSelector(selectWeddingState, (state: fromWedding.State) => state.partyMembers);

export const selectRsvpList = createSelector(selectWeddingState, (state: fromWedding.State) => state.rsvpList);
export const selectGiftList = createSelector(selectWeddingState, (state: fromWedding.State) => state.giftList);
