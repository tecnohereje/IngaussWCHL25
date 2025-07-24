import { Canister, query, update, Principal, StableBTreeMap, Result, Opt, Ok, Err, ic, nat, nat64, text, bool, Record, Variant, Vec, None } from 'azle';
import { UserAccount, UserProfile, Error } from './types.js';

let userAccounts = StableBTreeMap<Principal, typeof UserAccount.tsType>(0);

export default Canister({
    
    getOrCreateAccount: update([], UserAccount, () => {
        const caller = ic.caller();
        const accountOpt = userAccounts.get(caller);

        if ('None' in accountOpt) {
            const newAccount: typeof UserAccount.tsType = {
                principal: caller,
                createdAt: ic.time(),
                profile: {
                    // --- CORRECCIÓN DEFINITIVA: Se usa 'None' ---
                    fullName: None,
                    email: None,
                    bio: None,
                    isSearching: None,
                    shareContactInfo: None,
                    locations: None,
                    salaryRange: None,
                    workplaceTags: None,
                    preferredTimezone: None,
                    social: None
                },
                stats: {
                    level: 1n,
                    experiencePoints: 0n
                }
            };
            userAccounts.insert(caller, newAccount);
            return newAccount;
        }

        return accountOpt.Some;
    }),

    getMyAccount: query([], Opt(UserAccount), () => {
        return userAccounts.get(ic.caller());
    }),

    updateProfile: update([UserProfile], Result(text, Error), (newProfile) => {
        const caller = ic.caller();
        const accountOpt = userAccounts.get(caller);

        if ('None' in accountOpt) {
            return Result.Err({ NotFound: "User account does not exist." });
        }

        const account = accountOpt.Some;
        
        const updatedAccount: typeof UserAccount.tsType = {
            ...account,
            profile: newProfile
        };

        userAccounts.insert(caller, updatedAccount);

        return Result.Ok("Profile updated successfully.");
    })
});