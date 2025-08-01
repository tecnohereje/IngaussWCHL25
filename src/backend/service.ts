import { query, update, Principal, StableBTreeMap, time } from 'azle';
import {
    PersonalInfoCandidInterface, PersonalInfoType,
    SocialLinksCandidInterface, SocialLinksType,
    JobPreferencesCandidInterface, JobPreferencesType,
    UserAccountCandidInterface, UserAccountType
} from './types.js';


const userStorage = new StableBTreeMap<Principal, UserAccountType>(0);

export default class IngaussCanisterService
{
    @update([], UserAccountCandidInterface)
    getOrCreateAccount(): UserAccountType
    {
        const caller = ic.caller();
        const potentialAccount: UserAccountType | undefined = userStorage.get(caller);

        if (undefined === potentialAccount || 'None' in potentialAccount)
        {
            const newAccount: UserAccountType = 
            {
                principal: caller,
                createdAt: time(),
                profile:
                {
                    personal:
                    {
                        fullName: undefined,
                        email: undefined,
                        bio: undefined,
                        isSearching: true,
                        shareContactInfo: false,
                        profilePic: undefined,
                        cv: undefined
                    },
                    social: 
                    { 
                        linkedin: undefined, 
                        github: undefined, 
                        instagram: undefined, 
                        x: undefined, 
                        additional: undefined
                    },
                    job: 
                    { 
                        locations: undefined, 
                        salaryRange: undefined, 
                        workplaceTags: undefined, 
                        preferredTimezone: undefined 
                    }
                },
                stats: 
                { 
                    level: 1,
                    experiencePoints: 0n,
                    medals: [] 
                }
            };

            userStorage.insert(caller, newAccount);
            
            return newAccount;
        }

        const theUserAccount: UserAccountType | undefined = potentialAccount;

        return theUserAccount;
    }

    @query([], UserAccountCandidInterface)
    getCompleteUserAccount(): UserAccountType | undefined
    {
        const caller = ic.caller();
        return userStorage.get(caller);
    }


    @update([PersonalInfoCandidInterface])
    updatePersonalInfo(info: PersonalInfoType): void 
    {
        const caller = ic.caller();
        const userAccount: UserAccountType | undefined = userStorage.get(caller);

        if (undefined === userAccount || 'None' in userAccount) { return; }

        userAccount.profile.personal = info;
        userStorage.insert(caller, userAccount);
    }

    @query([], PersonalInfoCandidInterface)
    getPersonalInfo(): PersonalInfoType | undefined 
    {
        const caller = ic.caller();
        const userAccount = userStorage.get(caller);

        if (undefined === userAccount || 'None' in userAccount) {
            return undefined;
        }

        return userAccount.profile.personal;
    }

    
    @update([SocialLinksCandidInterface])
    updateSocialLinks(links: SocialLinksType): void 
    {
        const caller = ic.caller();
        const userAccount: UserAccountType | undefined = userStorage.get(caller);

        if (undefined === userAccount || 'None' in userAccount) { return; }
        
        userAccount.profile.social = links;
        userStorage.insert(caller, userAccount);
    }

    @query([], SocialLinksCandidInterface)
    getSocialLinks(): SocialLinksType | undefined 
    {
        const caller = ic.caller();
        const userAccount = userStorage.get(caller);

        if (undefined === userAccount || 'None' in userAccount) {
            return undefined;
        }

        return userAccount.profile.social;
    }

    
    @update([JobPreferencesCandidInterface])
    updateJobPreferences(prefs: JobPreferencesType): void 
    {
        const caller = ic.caller();
        const userAccount: UserAccountType | undefined = userStorage.get(caller);

        if (undefined === userAccount || 'None' in userAccount) { return; }
        
        userAccount.profile.job = prefs;
        userStorage.insert(caller, userAccount);
    }

    @query([], JobPreferencesCandidInterface)
    getJobPreferences(): JobPreferencesType | undefined 
    {
        const caller = ic.caller();
        const userAccount = userStorage.get(caller);

        if (undefined === userAccount || 'None' in userAccount) {
            return undefined;
        }

        return userAccount.profile.job;
    }

}