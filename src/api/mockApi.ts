import { Principal } from "@dfinity/principal";

// --- MODELO DE DATOS / JSON PARA EL CANISTER ---
export interface UserAccount {
  personal: {
    profilePic: File | null;
    fullName: string;
    email: string;
    bio: string;
    cv: File | null;
    isSearching: boolean;
    shareContactInfo: boolean;
  };
  social: {
    linkedin: string;
    github: string;
    instagram: string;
    x: string;
    additional: { id: number; url: string }[];
  };
  job: {
    locations: string[];
    salaryRange: [number, number];
    tags: string[];
    preferredTimezone: string;
  };
}

export interface EnrichedProfile {
  fullName?: string;
  email?: string;
  linkedin?: string;
  level?: number;
  balances?: { icp: number; rbtc: number; eth: number; };
  stats?: { score: number; experience: number; totalPlaytime: string; lastPlayed: string; };
  sponsors?: string[];
}

// --- FUNCIONES DE PERSISTENCIA LOCAL ---

const getStorageKey = (principal: Principal): string => `ingauss-user-account-${principal.toText()}`;

export const loadUserAccount = (principal: Principal): Promise<UserAccount | null> => {
  console.log(`[Persistence: local] Loading user account for ${principal.toText()}`);
  return new Promise(resolve => {
    setTimeout(() => {
      const data = localStorage.getItem(getStorageKey(principal));
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.personal) {
            parsed.personal.profilePic = null;
            parsed.personal.cv = null;
        }
        resolve(parsed);
      } else {
        resolve(null);
      }
    }, 200);
  });
};

export const saveUserAccount = (principal: Principal, partialAccount: Partial<UserAccount>): Promise<void> => {
  console.log(`[Persistence: local] Saving user account for ${principal.toText()}`);
  return new Promise(async resolve => {
    const defaultAccount: Partial<UserAccount> = {
      personal: { profilePic: null, fullName: '', email: '', bio: '', cv: null, isSearching: false, shareContactInfo: true },
      social: { linkedin: '', github: '', instagram: '', x: '', additional: [] },
      job: { locations: [], salaryRange: [0, 0], tags: [], preferredTimezone: '' }
    };
    const existingAccount = await loadUserAccount(principal) || defaultAccount;
    
    const newAccountData: UserAccount = {
      personal: { ...existingAccount.personal, ...partialAccount.personal } as UserAccount['personal'],
      social: { ...existingAccount.social, ...partialAccount.social } as UserAccount['social'],
      job: { ...existingAccount.job, ...partialAccount.job } as UserAccount['job'],
    };

    const dataToStore = { ...newAccountData };
    if (dataToStore.personal) {
        delete (dataToStore.personal as any).profilePic;
        delete (dataToStore.personal as any).cv;
    }

    localStorage.setItem(getStorageKey(principal), JSON.stringify(dataToStore));
    setTimeout(resolve, 500);
  });
};


// --- OTRAS FUNCIONES MOCK ---

export const fetchMarqueeTexts = (): Promise<string[]> => {
  console.log("Fetching marquee texts from API (mock)...");
  const mockTexts = [
    "Noticia de último minuto: El mercado de ICP sube un 15%!",
    "Recordatorio: La actualización del sistema será este domingo.",
    "¡Nuevas características disponibles en la Zona de Pruebas!",
  ];
  return new Promise(resolve => setTimeout(() => resolve(mockTexts), 2000));
};

export const fetchEnrichedProfile = async (principal: Principal): Promise<EnrichedProfile> => {
  console.log("Fetching enriched profile for:", principal.toText());
  const userAccount = await loadUserAccount(principal);

  if (Math.random() > 0.5) {
    const fullProfile: EnrichedProfile = {
      fullName: userAccount?.personal?.fullName || "Satoshi Nakamoto",
      email: userAccount?.personal?.email || "satoshi@gmx.com",
      linkedin: userAccount?.social?.linkedin,
      level: 12,
      balances: { icp: 10.45, rbtc: 0.005, eth: 0.12 },
      stats: { score: 1250, experience: 85, totalPlaytime: "48h", lastPlayed: new Date().toLocaleDateString() },
      sponsors: ['google', 'apple', 'microsoft', 'amazon', 'meta'],
    };
    return new Promise(resolve => setTimeout(() => resolve(fullProfile), 1000));
  } else {
    console.log("Simulating a new user with partial profile data.");
    const partialProfile: EnrichedProfile = {
      fullName: userAccount?.personal?.fullName,
      email: userAccount?.personal?.email,
      linkedin: userAccount?.social?.linkedin,
      balances: { icp: 0, rbtc: 0, eth: 0 }
    };
    return new Promise(resolve => setTimeout(() => resolve(partialProfile), 1000));
  }
};