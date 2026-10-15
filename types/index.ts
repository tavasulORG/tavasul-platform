export type Language = 'ar' | 'tr' | 'en';
export type Currency = 'USD' | 'TRY' | 'EUR' | 'SAR';

export type SectorSlug = 
  | 'education' 
  | 'health' 
  | 'emergency-relief' 
  | 'economic-empowerment' 
  | 'child-women' 
  | 'wash' 
  | 'shelter';

export type CountrySlug = 'turkey' | 'yemen' | 'syria' | 'palestine' | 'africa';

export interface LocalizedString {
  ar: string;
  tr: string;
  en: string;
}

export interface ProjectUpdate {
  date: string;
  title: LocalizedString;
  text: LocalizedString;
  image?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  sectorSlug: SectorSlug;
  countrySlug: CountrySlug;
  countryName: LocalizedString;
  targetGroups: LocalizedString[];
  beneficiariesCount: number;
  goalAmount: number; // in USD
  raisedAmount: number; // in USD
  donorsCount: number;
  status: 'urgent' | 'active' | 'completed';
  featured: boolean;
  coverImage: string;
  gallery: string[];
  updates: ProjectUpdate[];
  createdAt: string;
}

export interface Sector {
  id: string;
  slug: SectorSlug;
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  iconName: string;
  coverImage: string;
  objectives: LocalizedString[];
  stats: {
    projectsCount: number;
    beneficiariesCount: number;
    completedProjects: number;
  };
}

export interface CountryRegion {
  id: string;
  slug: CountrySlug;
  name: LocalizedString;
  headline: LocalizedString;
  overview: LocalizedString;
  flag: string;
  coverImage: string;
  beneficiariesCount: number;
  activeProjectsCount: number;
  keyInterventions: LocalizedString[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  currency: 'TRY' | 'USD' | 'EUR';
  iban: string;
  swiftCode: string;
  branchName: string;
  iconColor: string;
}

export interface DonationRecord {
  id: string;
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  isAnonymous: boolean;
  amount: number;
  currency: Currency;
  amountUSD: number;
  projectId?: string;
  projectTitle?: string;
  sectorSlug?: SectorSlug;
  paymentMethod: 'card' | 'bank_transfer';
  status: 'success' | 'pending';
  timestamp: string;
}

