export type Language = 'ar' | 'tr' | 'en';
export type Currency = 'USD' | 'TRY' | 'EUR' | 'SAR';

/** The sectors shipped with the site. New sectors added in the admin get their own slug. */
export type KnownSectorSlug =
  | 'education'
  | 'health'
  | 'emergency-relief'
  | 'economic-empowerment'
  | 'child-women'
  | 'wash'
  | 'shelter';
export type SectorSlug = KnownSectorSlug | (string & {});

/** The regions shipped with the site (and drawn on the map). New regions get their own slug. */
export type KnownCountrySlug = 'turkey' | 'yemen' | 'syria' | 'palestine' | 'africa';
export type CountrySlug = KnownCountrySlug | (string & {});

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
  sortOrder?: number;
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
  isActive?: boolean;
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

/* ----------------------------------------------------------------------------
 * Organization information (the About page), stored in organization_info.
 * ------------------------------------------------------------------------- */

export interface StorySection {
  title: string;
  lead: string;
  body: string;
}

export interface WhoSection {
  title: string;
  content: string;
}

export interface AboutGoal {
  id: string;
  ar: string;
  tr: string;
  en: string;
}

export interface AboutValue {
  id: string;
  number: string;
  ar: string;
  tr: string;
  en: string;
  desc: LocalizedString;
}

export interface TargetGroup {
  number: number;
  ar: string;
  tr: string;
  en: string;
}

export interface BoardMember {
  name: string;
  roleAr: string;
  roleTr: string;
  roleEn: string;
  /** Optional portrait uploaded in the admin; the initials icon shows otherwise. */
  photo?: string;
}

export interface GovernanceReport {
  year: string;
  titleAr: string;
  titleTr: string;
  titleEn: string;
  size: string;
  /** Uploaded PDF; the card becomes a download link when set. */
  url?: string;
}

export interface Partner {
  /** Stored as "Arabic name (Latin name)". */
  name: string;
  type: string;
  logo?: string;
  website?: string;
}

export interface OrganizationInfo {
  licenseNumber: string;
  foundedYear: number;
  foundationCity: string;
  originHeritage: string;
  ourStory: Record<Language, StorySection>;
  whoWeAre: Record<Language, WhoSection>;
  vision: LocalizedString;
  mission: LocalizedString;
  goals: AboutGoal[];
  values: AboutValue[];
  targetGroups: TargetGroup[];
  governance: {
    boardOfDirectors: BoardMember[];
    reports: GovernanceReport[];
  };
  partners: {
    funding: Partner[];
    implementing: Partner[];
  };
}

/* ----------------------------------------------------------------------------
 * Site settings, stored in site_settings (key = "general" / "home").
 * ------------------------------------------------------------------------- */

export interface SocialLinks {
  facebook: string;
  instagram: string;
  x: string;
  youtube: string;
  linkedin: string;
}

export interface SiteSettings {
  logo: string;
  heroVideo: string;
  heroPoster: string;
  aboutHeroImage: string;
  sectorsHeroImage: string;
  sectorsIndexImage: string;
  whereHeroImage: string;
  projectsHeroImage: string;
  phone: string;
  whatsapp: string;
  email: string;
  /** Free-text query opened in Google Maps from the contact page. */
  mapsQuery: string;
  socials: SocialLinks;
  /** Shows the "demo payment" notices while no gateway is connected. */
  demoPaymentMode: boolean;
}

export interface ImpactStory {
  id: string;
  projectSlug: string;
  iconName: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  gaugeHeader: LocalizedString;
  gaugeValue: LocalizedString;
  gaugeSub: LocalizedString;
  /** 0..1 */
  gaugeProgress: number;
  gaugeFootnote: LocalizedString;
}

export interface HomeContent {
  /** Paragraph above the impact stories on the home page. */
  impactHeadline: LocalizedString;
  impactStories: ImpactStory[];
}

/* ----------------------------------------------------------------------------
 * Admin
 * ------------------------------------------------------------------------- */

export type AdminRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  createdAt: string;
  lastSignInAt: string | null;
}

export interface ContactMessage {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  language: Language;
  status: 'new' | 'read' | 'archived';
  notes: string | null;
  createdAt: string;
}

export interface AuditEntry {
  id: number;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  tableName: string;
  recordId: string | null;
  summary: string | null;
  createdAt: string;
}

export interface MediaItem {
  /** Path inside the media bucket, e.g. images/1700000000-photo.jpg */
  path: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}
