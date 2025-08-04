import { Identity } from '@dfinity/agent';
import { createBackendActor } from './actor';
import type {
    UserAccountType,
    PersonalInfoType,
    SocialLinksType,
    JobPreferencesType
} from '../../../common/types';

// Helper function to convert a File object to a Uint8Array.
const fileToUint8Array = async (file: File): Promise<Uint8Array> => {
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
};

// --- User Account ---

export const getOrCreateAccount = async (identity: Identity): Promise<UserAccountType> => {
    const backendActor = await createBackendActor(identity);
    return await backendActor.getOrCreateAccount() as UserAccountType;
};

export const getCompleteUserAccount = async (identity: Identity): Promise<UserAccountType | undefined> => {
    const backendActor = await createBackendActor(identity);
    const result = await backendActor.getCompleteUserAccount() as [] | [UserAccountType];
    // Azle's Opt type is represented as a one-element array for Some, and an empty array for None.
    return result.length > 0 ? result[0] : undefined;
};

// --- Personal Info ---

export const updatePersonalInfo = async (identity: Identity, info: PersonalInfoType): Promise<void> => {
    const backendActor = await createBackendActor(identity);
    
    // Create a copy to avoid mutating the original state object.
    const infoToSend = { ...info };

    // Convert File objects to Uint8Array before sending to the canister.
    if (info.profilePic instanceof File) {
        infoToSend.profilePic = await fileToUint8Array(info.profilePic);
    }
    if (info.cv instanceof File) {
        infoToSend.cv = await fileToUint8Array(info.cv);
    }

    await backendActor.updatePersonalInfo(infoToSend);
};

export const getPersonalInfo = async (identity: Identity): Promise<PersonalInfoType | undefined> => {
    const backendActor = await createBackendActor(identity);
    const result = await backendActor.getPersonalInfo() as [] | [PersonalInfoType];
    return result.length > 0 ? result[0] : undefined;
};

// --- Social Links ---

export const updateSocialLinks = async (identity: Identity, links: SocialLinksType): Promise<void> => {
    const backendActor = await createBackendActor(identity);
    await backendActor.updateSocialLinks(links);
};

export const getSocialLinks = async (identity: Identity): Promise<SocialLinksType | undefined> => {
    const backendActor = await createBackendActor(identity);
    const result = await backendActor.getSocialLinks() as [] | [SocialLinksType];
    return result.length > 0 ? result[0] : undefined;
};

// --- Job Preferences ---

export const updateJobPreferences = async (identity: Identity, prefs: JobPreferencesType): Promise<void> => {
    const backendActor = await createBackendActor(identity);
    await backendActor.updateJobPreferences(prefs);
};

export const getJobPreferences = async (identity: Identity): Promise<JobPreferencesType | undefined> => {
    const backendActor = await createBackendActor(identity);
    const result = await backendActor.getJobPreferences() as [] | [JobPreferencesType];
    return result.length > 0 ? result[0] : undefined;
};