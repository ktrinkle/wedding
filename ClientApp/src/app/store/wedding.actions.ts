import { createAction, props } from '@ngrx/store';
import { weddingPartyMemberDto, weddingPartyGiftDto } from '../data/data';

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

export const giftList = createAction(
  '[Wedding] GiftList',
);

export const giftListSuccess = createAction(
  '[Wedding] GiftListSuccess',
  props<{ giftList: weddingPartyGiftDto[] }>()
);

export const saveGift = createAction(
  '[Wedding] SaveGift',
  props<{ partyGift: weddingPartyGiftDto }>()
);

export const saveGiftSuccess = createAction(
  '[Wedding] SaveGiftSuccess',
  props<{ partyGifts: weddingPartyGiftDto[] }>()
);



