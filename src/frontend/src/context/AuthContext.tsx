import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { iiDerivationOrigin, loginLogoUrl } from '../config/features';
import { getOrCreateAccount } from '../api/backend';
import type { UserAccountType } from '../../../common/types';

type UserProfile = UserAccountType;

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  authClient: AuthClient | null;
  identity: Identity | null;
  principal: Principal | null;
  userProfile: UserProfile | null;
  loginWithNfid: () => Promise<void>;
  loginWithIi: () => Promise<void>;
  loginAsDevelopmentUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (newProfileData: Partial<UserProfile>) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        if (await client.isAuthenticated()) {
          const userIdentity = client.getIdentity();
          await handleAuthenticated(userIdentity, client);
        }
      } catch (error) { console.error(error); }
      finally {
        setIsAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = (options: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!authClient) {
        return reject(new Error("AuthClient not initialized"));
      }
      await authClient.login({
        ...options,
        onSuccess: async () => {
          try {
            const userIdentity = authClient.getIdentity();
            await handleAuthenticated(userIdentity, authClient);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        onError: (err) => {
          console.error("Login Error:", err);
          reject(err);
        },
      });
    });
  };

  const loginWithNfid = (): Promise<void> => {
    const nfidProvider = `https://nfid.one/authenticate?appName=Mi+App+de+Demo&appLogo=${loginLogoUrl}&theme=dark&_cache=${Date.now()}`;
    return handleLogin({
      identityProvider: nfidProvider,
      windowOpenerFeatures: `left=${window.screen.width / 2 - 288},top=${window.screen.height / 2 - 312},width=576,height=625`,
    });
  };

  const loginWithIi = (): Promise<void> => {
    return handleLogin({
      identityProvider: 'https://identity.ic0.app',
      windowOpenerFeatures: `left=${window.screen.width / 2 - 288},top=${window.screen.height / 2 - 312},width=576,height=625`,
      derivationOrigin: iiDerivationOrigin,
      maxTimeToLive: BigInt(8 * 60 * 60 * 1_000_000_000),
    });
  };

  const loginAsDevelopmentUser = async (): Promise<void> => {
    // This creates a constant identity from a fixed seed phrase.
    // NOTE: This is NOT secure and should ONLY be used for development.
    const seed = new Uint8Array(32).fill(42); // A 32-byte array filled with the number 42.
    const identity = Ed25519KeyIdentity.generate(seed);

    if (authClient) {
      await handleAuthenticated(identity, authClient);
    }
  };

  const logout = async (): Promise<void> => {
    if (!authClient) return;
    await authClient.logout();
    setIdentity(null);
    setPrincipal(null);
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const handleAuthenticated = async (userIdentity: Identity, client: AuthClient): Promise<void> => {
    const userPrincipal = userIdentity.getPrincipal();
    setIdentity(userIdentity);
    setPrincipal(userPrincipal);
    setAuthClient(client);
    setIsAuthenticated(true);
    
    setIsProfileLoading(true);
    try {
      const profile = await getOrCreateAccount(userIdentity);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserProfile(null);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const updateUserProfile = (newProfileData: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return null;
      return { ...prevProfile, ...newProfileData };
    });
  };
  
  const value: AuthContextType = {
    isAuthenticated,
    isAuthLoading,
    isProfileLoading,
    authClient,
    identity,
    principal,
    userProfile,
    loginWithNfid,
    loginWithIi,
    loginAsDevelopmentUser,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};