import { Guid } from "typescript-guid";

export interface frontLogin {
  emailAddress: string,
  password: string,
}

export interface bearerDto {
  partyGuid?: string,
  partyAddress?: string,
  bearerToken?: string
}

export interface simpleUser {
  partyAddress?: string,
  partyGuid?: string
}

export interface weddingPartyMemberDto {
  groupMemberId: number,
  groupMemberName: string,
  rsvpYes? : boolean,
  rsvpComment? : string
}

export interface weddingPartyDto {
    groupId: string,
    emailAddress: string,
    partyMembers: [weddingPartyMemberDto]
}
