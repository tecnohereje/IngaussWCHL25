import { IDL, Principal } from 'azle';

export const PersonalInfoCandidInterface = IDL.Record({
    fullName: IDL.Opt(IDL.Text),
    email: IDL.Opt(IDL.Text),
    bio: IDL.Opt(IDL.Text),
    isSearching: IDL.Opt(IDL.Bool),
    shareContactInfo: IDL.Opt(IDL.Bool),
    profilePic: IDL.Opt(IDL.Vec(IDL.Nat8)),
    cv: IDL.Opt(IDL.Vec(IDL.Nat8)),
});
export type PersonalInfoType = {
    fullName?: string;
    email?: string;
    bio?: string;
    isSearching?: boolean;
    shareContactInfo?: boolean;
    profilePic?: Uint8Array | File;
    cv?: Uint8Array | File;
};

export const SocialLinksCandidInterface = IDL.Record({
    linkedin: IDL.Opt(IDL.Text),
    github: IDL.Opt(IDL.Text),
    instagram: IDL.Opt(IDL.Text),
    x: IDL.Opt(IDL.Text),
    additional: IDL.Opt(IDL.Vec(IDL.Text)),
});
export type SocialLinksType = {
    linkedin?: string;
    github?: string;
    instagram?: string;
    x?: string;
    additional?: string[];
};

export const JobPreferencesCandidInterface = IDL.Record({
    locations: IDL.Opt(IDL.Vec(IDL.Text)),
    salaryRange: IDL.Opt(IDL.Vec(IDL.Nat)),
    workplaceTags: IDL.Opt(IDL.Vec(IDL.Text)),
    preferredTimezone: IDL.Opt(IDL.Text),
});
export type JobPreferencesType = {
    locations?: string[];
    salaryRange?: number[];
    workplaceTags?: string[];
    preferredTimezone?: string;
};

export const UserProfileCandidInterface = IDL.Record({
    personal: PersonalInfoCandidInterface,
    social: SocialLinksCandidInterface,
    job: JobPreferencesCandidInterface,
});
export type UserProfileType = {
    personal: PersonalInfoType;
    social: SocialLinksType;
    job: JobPreferencesType;
};

export const UserStatsCandidInterface = IDL.Record({
    level: IDL.Nat,
    experiencePoints: IDL.Nat64,
    medals: IDL.Opt(IDL.Vec(IDL.Record({ 
        medalTitle: IDL.Text,
        medalImageUrl: IDL.Text, 
        medalDescription: IDL.Text,
    })))
});
export type UserStatsType = {
    level: number;
    experiencePoints: bigint;
    medals:
    {
        medalTitle: string;
        medalImageUrl: string; 
        medalDescription: string;
    }[]
};

export const UserAccountCandidInterface = IDL.Record({
    principal: IDL.Principal,
    createdAt: IDL.Nat64,
    profile: UserProfileCandidInterface,
    stats: UserStatsCandidInterface,
});
export type UserAccountType = {
    principal: Principal;
    createdAt: bigint;
    profile: UserProfileType;
    stats: UserStatsType;
};