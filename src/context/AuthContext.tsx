import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { iiDerivationOrigin, loginLogoUrl } from '../config/features';

// --- Interfaces y tipos (sin cambios) ---
interface UserProfile {
  fullName: string;
  email: string;
  linkedin: string;
  level: number;
  balances: {
    icp: number;
    rbtc: number;
    eth: number;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isProfileLoading: boolean;
  identity: Identity | null;
  principal: Principal | null;
  userProfile: UserProfile | null;
  loginWithNfid: () => Promise<void>;
  loginWithIi: () => Promise<void>;
  logout: () => Promise<void>;
  bypassLogin: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserProfile = (principal: Principal): Promise<UserProfile> => {
  console.log("Fetching profile for principal:", principal.toText());
  const mockProfile: UserProfile = {
    fullName: "Satoshi Nakamoto",
    email: "satoshi@gmx.com",
    linkedin: "/in/satoshi",
    level: 12,
    balances: { icp: 10.45, rbtc: 0.005, eth: 0.12 },
  };
  return new Promise(resolve => setTimeout(() => resolve(mockProfile), 1500));
};

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
          await handleAuthenticated(userIdentity);
        }
      } catch (error) { console.error(error); }
      finally {
        setIsAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- REFACTOR: Las funciones de login ahora devuelven una Promesa ---
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
            await handleAuthenticated(userIdentity);
            resolve(); // El login fue exitoso
          } catch (e) {
            reject(e);
          }
        },
        onError: (err) => {
          console.error("Login Error:", err);
          reject(err); // El login falló
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

  const logout = async (): Promise<void> => {
    if (!authClient) return;
    await authClient.logout();
    setIdentity(null);
    setPrincipal(null);
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const handleAuthenticated = async (userIdentity: Identity): Promise<void> => {
    setIsProfileLoading(true);
    const userPrincipal = userIdentity.getPrincipal();
    const profile = await fetchUserProfile(userPrincipal);
    setIdentity(userIdentity);
    setPrincipal(userPrincipal);
    setUserProfile(profile);
    setIsAuthenticated(true);
    setIsProfileLoading(false);
  };

  const bypassLogin = (): void => {
    console.warn("Bypassing real authentication. For development use only.");
    const mockPrincipal = Principal.fromText("qoctq-giaaa-aaaaa-aaaea-cai");
    const mockProfile: UserProfile = {
      fullName: "Dev User",
      email: "dev@user.com",
      linkedin: "",
      level: 99,
      balances: { icp: 123, rbtc: 0.1, eth: 2.5 },
    };
    setIdentity(null);
    setPrincipal(mockPrincipal);
    setUserProfile(mockProfile);
    setIsAuthenticated(true);
  };
  
  const value: AuthContextType = {
    isAuthenticated,
    isAuthLoading,
    isProfileLoading,
    identity,
    principal,
    userProfile,
    loginWithNfid,
    loginWithIi,
    logout,
    bypassLogin,
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