import { Guid } from "typescript-guid";

export enum RsvpDrinkType {
  'Non-Alcoholic',
  'Mocktail',
  'Alcoholic'
}

export const RsvpDrinkMapping: Record<RsvpDrinkType, string> = {
  [RsvpDrinkType["Non-Alcoholic"]]: "Non-Alcoholic",
  [RsvpDrinkType.Mocktail]: "Mocktail",
  [RsvpDrinkType.Alcoholic]: "Alcoholic",
};

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
  groupId?: Guid,
  groupMemberId: number,
  groupMemberName: string,
  rsvpYes? : boolean,
  rsvpComment? : string,
  rsvpDrinkType? : RsvpDrinkType
}

export interface weddingPartyDto {
    groupId: string,
    emailAddress: string,
    partyMembers: [weddingPartyMemberDto]
}

export interface weddingPartyGiftDto {
  groupId: Guid,
  firstGroupMemberName?: string,
  rsvpYes?: boolean,
  giftComment?: string,
  giftAmount?: number,
  giftDate?: Date
}
