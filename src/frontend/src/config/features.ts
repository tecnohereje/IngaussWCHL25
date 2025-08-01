// --- AUTHENTICATION FEATURE FLAGS ---
export const isNfidLoginEnabled: boolean = import.meta.env.VITE_FEATURE_NFID_LOGIN_ENABLED === 'true';
export const isIiLoginEnabled: boolean = import.meta.env.VITE_FEATURE_II_LOGIN_ENABLED === 'true';
export const isDevLoginEnabled: boolean = import.meta.env.VITE_FEATURE_DEV_LOGIN_ENABLED === 'true';

// --- OTHER FEATURE FLAGS ---
export const isLanguageSelectorEnabled: boolean = import.meta.env.VITE_FEATURE_LANGUAGE_SELECTOR_ENABLED !== 'false';
export const isThemeSwitchEnabled: boolean = import.meta.env.VITE_FEATURE_THEME_SWITCH_ENABLED !== 'false';
export const isUserProfileEnabled: boolean = import.meta.env.VITE_FEATURE_USER_PROFILE_ENABLED !== 'false';
export const isSettingsZoneEnabled: boolean = import.meta.env.VITE_FEATURE_SETTINGS_ZONE_ENABLED !== 'false';
export const isTestingZoneEnabled: boolean = import.meta.env.VITE_FEATURE_TESTING_ZONE_ENABLED !== 'false';
export const isMarqueeEnabled: boolean = import.meta.env.VITE_FEATURE_MARQUEE_ENABLED === 'true';

// --- FORM CONFIGURATION ---
export const maxProfilePicSize: number = (parseInt(import.meta.env.VITE_MAX_PROFILE_PIC_SIZE_KB, 10) || 100) * 1024;
export const maxResumeSize: number = (parseInt(import.meta.env.VITE_MAX_RESUME_SIZE_KB, 10) || 100) * 1024;

export const salaryRange: { min: number; max: number } = {
  min: parseInt(import.meta.env.VITE_SALARY_MIN || '0', 10),
  max: parseInt(import.meta.env.VITE_SALARY_MAX || '200000', 10),
};

const defaultTags: string = 'good_culture,growth_opportunities,innovative_culture,diverse_team,flexible_remote,competitive_salary,high_impact_projects,cutting_edge_tech,autonomy,health_benefits,training,collaborative_environment';
export const workplaceTags: string[] = (import.meta.env.VITE_WORKPLACE_TAGS || defaultTags).split(',');

export const maxWorkplaceTags: number = parseInt(import.meta.env.VITE_MAX_WORKPLACE_TAGS || '3', 10);

// --- APP CONFIGURATION ---
export const loginLogoUrl: string = import.meta.env.VITE_APP_LOGIN_LOGO_URL || '/img/IngaussLogoSol.webp';
export const iiDerivationOrigin: string = import.meta.env.VITE_II_DERIVATION_ORIGIN || 'http://localhost:5173';
export const headerLogoUrl: string = import.meta.env.VITE_HEADER_LOGO_URL || '/img/IngaussLogoMin.webp';
export const marqueeDefaultText: string = import.meta.env.VITE_MARQUEE_DEFAULT_TEXT || 'Welcome to our platform.';

// --- PERSISTENCE CONFIGURATION ---
export const persistenceMode: 'local' | 'canister' = (import.meta.env.VITE_PERSISTENCE_MODE === 'canister' ? 'canister' : 'local');
export const userAccountCanisterId: string = import.meta.env.VITE_USER_ACCOUNT_CANISTER_ID || '';
export const icHostUrl: string = import.meta.env.VITE_IC_HOST_URL || '';