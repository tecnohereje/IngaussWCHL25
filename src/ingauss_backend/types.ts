import { Record, Opt, Vec, Principal, nat, nat64, text, bool } from 'azle';

// Se definen los tipos usando Record, que es la forma correcta para Azle
export const SocialLinks = Record({
    linkedin: Opt(text),
    github: Opt(text),
    instagram: Opt(text),
    x: Opt(text),
    additional: Opt(Vec(text)),
});

export const UserProfile = Record({
    fullName: Opt(text),
    email: Opt(text),
    bio: Opt(text),
    isSearching: Opt(bool),
    shareContactInfo: Opt(bool),
    locations: Opt(Vec(text)),
    salaryRange: Opt(Vec(nat)),
    workplaceTags: Opt(Vec(text)),
    preferredTimezone: Opt(text),
    social: Opt(SocialLinks),
});

export const UserStats = Record({
    level: nat,
    experiencePoints: nat,
});

export const UserAccount = Record({
    principal: Principal,
    createdAt: nat64,
    profile: UserProfile,
    stats: UserStats,
});

export const Error = Record({
    NotFound: text,
});