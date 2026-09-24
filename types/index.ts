export type ServiceCategory = 'web' | 'branding' | 'marketing' | 'courses';
export type RegionCurrency = 'EGP' | 'SAR';
export type CountryCode = 'EG' | 'GULF';
export type PortalMode = 'agency' | 'academy';

export interface PackagePricingItem {
  fromPrice: number;
  toPrice?: number;
  display: string;
}

export interface PackageOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
  recommended?: boolean;
  basePrice?: number;
  priceDisplay?: string;
  pricing?: {
    EGP: PackagePricingItem;
    SAR: PackagePricingItem;
  };
  suitableFields?: string[];
  features: string[];
}

export interface AddonPricingItem {
  price: number;
  display: string;
}

export interface AddonOption {
  id: string;
  name: string;
  description: string;
  technicalSpecs?: string;
  price?: number;
  priceDisplay?: string;
  pricing?: {
    EGP: AddonPricingItem;
    SAR: AddonPricingItem;
  };
}

export interface ServiceDefinition {
  id: ServiceCategory;
  title: string;
  shortDescription: string;
  iconName: string;
  packages: PackageOption[];
  addons: AddonOption[];
}

export interface CourseItem {
  id: string;
  title: string;
  category: 'design' | 'ai';
  subtitle: string;
  description: string;
  level: string;
  duration: string;
  format: string;
  price: string;
  seatsLeft: number;
  highlight: string;
  topics: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  categoryTag: 'web' | 'branding' | 'marketing';
  description: string;
  image: string;
  results: string;
}

export interface LeadSubmission {
  clientName?: string;
  phone: string;
  country?: string;
  currency?: RegionCurrency;
  serviceCategory?: ServiceCategory;
  selectedPackage?: string;
  selectedAddons?: string[];
  estimatedTotal?: number;
  clientNotes?: string;
  adSource?: string;
}
