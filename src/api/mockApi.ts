import { Principal } from "@dfinity/principal";

// --- MODELO DE DATOS / JSON PARA EL CANISTER ---
// Este es el "contrato de datos" que define la estructura completa del perfil de un usuario.
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

const LOCAL_STORAGE_KEY = 'ingauss-user-account';

// Carga la cuenta de usuario completa desde el localStorage.
export const loadUserAccount = (): Promise<UserAccount | null> => {
  console.log(`[Persistence: local] Loading user account from localStorage.`);
  return new Promise(resolve => {
    setTimeout(() => {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Omitimos los archivos al cargar, ya que no se pueden serializar en JSON
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

// Guarda una parte de la cuenta de usuario, fusionándola con los datos existentes.
export const saveUserAccount = (partialAccount: Partial<UserAccount>): Promise<void> => {
  console.log(`[Persistence: local] Saving user account to localStorage.`);
  return new Promise(async resolve => {
    const defaultAccount: Partial<UserAccount> = {
      personal: { profilePic: null, fullName: '', email: '', bio: '', cv: null, isSearching: false, shareContactInfo: true },
      social: { linkedin: '', github: '', instagram: '', x: '', additional: [] },
      job: { locations: [], salaryRange: [0, 0], tags: [], preferredTimezone: '' }
    };

    const existingAccount = await loadUserAccount() || defaultAccount;
    
    // Fusiona los datos viejos con los nuevos de forma segura
    const newAccountData: UserAccount = {
      personal: { ...existingAccount.personal, ...partialAccount.personal } as UserAccount['personal'],
      social: { ...existingAccount.social, ...partialAccount.social } as UserAccount['social'],
      job: { ...existingAccount.job, ...partialAccount.job } as UserAccount['job'],
    };

    // No guardamos los objetos de archivo en localStorage
    const dataToStore = { ...newAccountData };
    if (dataToStore.personal) {
        delete (dataToStore.personal as any).profilePic;
        delete (dataToStore.personal as any).cv;
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
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

export const fetchEnrichedProfile = (principal: Principal): Promise<EnrichedProfile> => {
  console.log("Fetching enriched profile from our backend for:", principal.toText());

  if (Math.random() > 0.5) {
    const mockProfile: EnrichedProfile = {
      fullName: "Satoshi Nakamoto",
      email: "satoshi@gmx.com",
      linkedin: "/in/satoshi",
      level: 12,
      balances: { icp: 10.45, rbtc: 0.005, eth: 0.12 },
      stats: {
        score: 1250,
        experience: 85,
        totalPlaytime: "48h",
        lastPlayed: new Date().toLocaleDateString(),
      },
      sponsors: ['google', 'apple', 'microsoft', 'amazon', 'meta'],
    };
    return new Promise(resolve => setTimeout(() => resolve(mockProfile), 1500));
  } else {
    console.log("Simulating a new user with partial profile data.");
    const partialProfile: EnrichedProfile = {
        fullName: "New User",
        balances: { icp: 0, rbtc: 0, eth: 0 }
    };
    return new Promise(resolve => setTimeout(() => resolve(partialProfile), 1500));
  }
};