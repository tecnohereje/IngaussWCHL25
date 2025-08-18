import IngaussCanisterService from '../src/backend/service';
import { Principal, StableBTreeMap } from 'azle';
import { PersonalInfoType, UserAccountType } from '../src/common/types';

// This is the in-memory storage for our mock.
let mockStorage = new Map<string, UserAccountType>();

// Mock the StableBTreeMap class from 'azle'
jest.mock('azle', () => ({
    ...jest.requireActual('azle'), // Import and retain all original exports
    StableBTreeMap: jest.fn().mockImplementation(() => ({
        get: jest.fn((key) => mockStorage.get(key.toText())),
        insert: jest.fn((key, value) => mockStorage.set(key.toText(), value)),
        isEmpty: jest.fn(() => mockStorage.size === 0),
    })),
}));

// Manually define the global 'ic' object for testing purposes
(global as any).ic = {
    caller: () => Principal.fromText('2vxsx-fae'),
    time: () => BigInt(new Date().getTime()),
};

describe('IngaussCanisterService', () => {
    let service: IngaussCanisterService;
    const mockCaller = Principal.fromText('2vxsx-fae');

    beforeEach(() => {
        mockStorage.clear();
        // Re-instantiate the service before each test to ensure a clean state
        service = new IngaussCanisterService();
    });

    it('should create a new account if one does not exist', () => {
        const newAccount = service.getOrCreateAccount();

        expect(newAccount).toBeDefined();
        expect(newAccount.principal.toText()).toEqual(mockCaller.toText());
        expect(newAccount.stats.level).toEqual(1);
        expect(mockStorage.get(mockCaller.toText())).toEqual(newAccount);
    });

    it('should return an existing account if one exists', () => {
        const firstCall = service.getOrCreateAccount();
        expect(mockStorage.size).toBe(1);

        const secondCall = service.getOrCreateAccount();
        expect(mockStorage.size).toBe(1);

        expect(secondCall.principal.toText()).toEqual(firstCall.principal.toText());
        expect(secondCall.createdAt).toEqual(firstCall.createdAt);
    });

    it('should update personal info for an existing account', () => {
        service.getOrCreateAccount();

        const newInfo: PersonalInfoType = {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            bio: 'A new bio',
            isSearching: false,
            shareContactInfo: true,
        };

        service.updatePersonalInfo(newInfo);

        const updatedAccount = service.getCompleteUserAccount();
        
        expect(updatedAccount).toBeDefined();
        expect(updatedAccount?.profile.personal.fullName).toEqual('John Doe');
        expect(updatedAccount?.profile.personal.isSearching).toBe(false);
    });
});