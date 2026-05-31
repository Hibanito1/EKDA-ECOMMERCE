/**
 * EKDA Internationalization (i18n) Setup
 *
 * Architecture: Dictionary-based i18n with Next.js middleware routing
 *
 * Supported languages:
 * - en: English (default)
 * - yo: Yoruba
 * - ig: Igbo
 * - ha: Hausa
 * - pcm: Nigerian Pidgin
 * - fr: French
 *
 * To add a new language:
 * 1. Add language code to SUPPORTED_LANGUAGES
 * 2. Create translation file in /src/lib/i18n/dictionaries/{lang}.ts
 * 3. Add to getDictionary function
 */

export const SUPPORTED_LANGUAGES = ["en", "yo", "ig", "ha", "pcm", "fr"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  yo: "Yorùbá",
  ig: "Igbo",
  ha: "Hausa",
  pcm: "Naija Pidgin",
  fr: "Français",
};

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

// ─── Translation Dictionary Type ─────────────────────────────────────────────

export interface Dictionary {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    back: string;
    next: string;
    submit: string;
    continue: string;
    confirm: string;
    close: string;
    viewAll: string;
    learnMore: string;
    getStarted: string;
    signIn: string;
    signOut: string;
    createAccount: string;
  };
  nav: {
    home: string;
    marketplace: string;
    exports: string;
    imports: string;
    b2b: string;
    learn: string;
    help: string;
    sustainability: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    shopExports: string;
    importToNigeria: string;
    escrowProtected: string;
    aiCompliance: string;
    multiCurrency: string;
    realTimeTracking: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyDescription: string;
    subtotal: string;
    shipping: string;
    commission: string;
    total: string;
    checkout: string;
    escrowProtected: string;
    escrowDescription: string;
    mixedCargoWarning: string;
  };
  checkout: {
    title: string;
    delivery: string;
    carrier: string;
    payment: string;
    confirm: string;
    placingOrder: string;
    orderSuccess: string;
    escrowNote: string;
  };
  auth: {
    signIn: string;
    signInSubtitle: string;
    signUp: string;
    signUpSubtitle: string;
    email: string;
    password: string;
    forgotPassword: string;
    orContinueWith: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    chooseRole: string;
  };
  kyc: {
    title: string;
    subtitle: string;
    personalInfo: string;
    idVerification: string;
    businessDetails: string;
    addressProof: string;
    bankInfo: string;
    reviewSubmit: string;
  };
  escrow: {
    title: string;
    held: string;
    firstRelease: string;
    secondRelease: string;
    commission: string;
    protected: string;
  };
}

// ─── English Dictionary ───────────────────────────────────────────────────────

const en: Dictionary = {
  common: {
    loading: "Loading...",
    error: "Something went wrong",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    back: "Back",
    next: "Next",
    submit: "Submit",
    continue: "Continue",
    confirm: "Confirm",
    close: "Close",
    viewAll: "View all",
    learnMore: "Learn more",
    getStarted: "Get Started",
    signIn: "Sign In",
    signOut: "Sign Out",
    createAccount: "Create Account",
  },
  nav: {
    home: "Home",
    marketplace: "Marketplace",
    exports: "African Exports",
    imports: "Global Imports",
    b2b: "B2B",
    learn: "Learn",
    help: "Help",
    sustainability: "Green Trade",
  },
  home: {
    heroTitle: "Export African Excellence. Import Global Innovation.",
    heroSubtitle: "Shop authentic African groceries or import cars, electronics, and machinery to Nigeria — with AI-powered compliance and escrow protection.",
    shopExports: "Shop African Goods",
    importToNigeria: "Import to Nigeria",
    escrowProtected: "Escrow Protected",
    aiCompliance: "AI Compliance",
    multiCurrency: "Multi-Currency",
    realTimeTracking: "Real-Time Tracking",
  },
  cart: {
    title: "Shopping Cart",
    empty: "Your cart is empty",
    emptyDescription: "Discover authentic African products or import quality goods",
    subtotal: "Subtotal",
    shipping: "Estimated Shipping",
    commission: "EKDA Commission",
    total: "Total",
    checkout: "Proceed to Checkout",
    escrowProtected: "Escrow Protected",
    escrowDescription: "100% held in escrow. 50% released at pickup, 50% at delivery.",
    mixedCargoWarning: "Mixed cargo types detected. Items will be shipped separately.",
  },
  checkout: {
    title: "Checkout",
    delivery: "Delivery",
    carrier: "Select Carrier",
    payment: "Payment",
    confirm: "Confirm",
    placingOrder: "Placing your order...",
    orderSuccess: "Order Placed Successfully!",
    escrowNote: "Your payment is secured in escrow. Released in stages as your shipment progresses.",
  },
  auth: {
    signIn: "Welcome back",
    signInSubtitle: "Sign in to your EKDA account",
    signUp: "Create your account",
    signUpSubtitle: "Join Africa's premier cross-border marketplace",
    email: "Email address",
    password: "Password",
    forgotPassword: "Forgot password?",
    orContinueWith: "or",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    chooseRole: "Choose your role",
  },
  kyc: {
    title: "KYC Verification",
    subtitle: "Verify your identity to start trading",
    personalInfo: "Personal Info",
    idVerification: "ID Verification",
    businessDetails: "Business Details",
    addressProof: "Address Proof",
    bankInfo: "Bank Information",
    reviewSubmit: "Review & Submit",
  },
  escrow: {
    title: "Escrow Protection",
    held: "Held in Escrow",
    firstRelease: "Released at Pickup",
    secondRelease: "Released at Delivery",
    commission: "EKDA Commission",
    protected: "100% Escrow Protected",
  },
};

// ─── Yoruba Dictionary (Partial — as example) ─────────────────────────────────

const yo: Partial<Dictionary> = {
  common: {
    ...en.common,
    loading: "Ń bẹrẹ...",
    search: "Ṣawari",
    save: "Fipamọ",
    cancel: "Fagilee",
    signIn: "Wọle",
    signOut: "Jade",
    createAccount: "Ṣẹda akọọlẹ",
    back: "Padà",
    next: "Tẹsiwaju",
    submit: "Firanṣẹ",
    continue: "Tẹsiwaju",
    confirm: "Jẹrisi",
    close: "Pa",
    viewAll: "Wo gbogbo",
    learnMore: "Kọ ẹkọ diẹ sii",
    getStarted: "Bẹrẹ",
    delete: "Pa",
    edit: "Ṣatunṣe",
    error: "Nkan ko tọ",
  },
};

// ─── Pidgin Dictionary (Partial) ──────────────────────────────────────────────

const pcm: Partial<Dictionary> = {
  common: {
    ...en.common,
    loading: "E dey load...",
    search: "Find am",
    save: "Save am",
    cancel: "Cancel",
    signIn: "Enter",
    signOut: "Comot",
    createAccount: "Open account",
    back: "Go back",
    next: "Next",
    submit: "Submit",
    continue: "Continue",
    confirm: "Confirm am",
    close: "Close",
    viewAll: "See all",
    learnMore: "Learn more",
    getStarted: "Start now",
    delete: "Remove",
    edit: "Change am",
    error: "Error don happen",
  },
};

// ─── Dictionary Loader ─────────────────────────────────────────────────────────

const dictionaries: Record<string, Partial<Dictionary>> = { en, yo, pcm };

export function getDictionary(lang: SupportedLanguage = "en"): Dictionary {
  const dict = dictionaries[lang] || {};
  // Deep merge with English fallback
  return deepMerge(en, dict) as Dictionary;
}

function deepMerge(base: object, override: object): object {
  const result = { ...base };
  for (const key in override) {
    const bVal = (base as Record<string, unknown>)[key];
    const oVal = (override as Record<string, unknown>)[key];
    if (oVal && typeof oVal === "object" && !Array.isArray(oVal) && bVal && typeof bVal === "object") {
      (result as Record<string, unknown>)[key] = deepMerge(bVal as object, oVal as object);
    } else if (oVal !== undefined) {
      (result as Record<string, unknown>)[key] = oVal;
    }
  }
  return result;
}

// ─── React Hook (Client) ──────────────────────────────────────────────────────

export function useTranslation(lang: SupportedLanguage = "en") {
  const dict = getDictionary(lang);
  return {
    t: (key: string): string => {
      const keys = key.split(".");
      let value: unknown = dict;
      for (const k of keys) {
        if (typeof value === "object" && value !== null) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // fallback to key if not found
        }
      }
      return typeof value === "string" ? value : key;
    },
    lang,
  };
}
