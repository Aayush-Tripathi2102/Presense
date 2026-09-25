export type ServiceCategoryId =
  | "search" | "advertising" | "social" | "video" | "content"
  | "crm" | "commerce" | "reputation" | "growth" | "analytics";

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  description: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "search", name: "Search", description: "Organic visibility and search optimization" },
  { id: "advertising", name: "Advertising", description: "Paid acquisition across networks" },
  { id: "social", name: "Social Media", description: "Organic social presence and publishing" },
  { id: "video", name: "Video", description: "Video channels and short-form content" },
  { id: "content", name: "Content", description: "Content creation and on-site optimization" },
  { id: "crm", name: "CRM", description: "Email, messaging and retention" },
  { id: "commerce", name: "Commerce", description: "Marketplaces and shopping surfaces" },
  { id: "reputation", name: "Reputation", description: "Reviews and brand trust" },
  { id: "growth", name: "Growth", description: "Experimentation and partnerships" },
  { id: "analytics", name: "Analytics", description: "Measurement, attribution and reporting" },
];

export type ServiceStatus = "coming_soon" | "beta" | "active" | "deprecated";

export type ServiceFieldType =
  | "text" | "textarea" | "url" | "number" | "select"
  | "multiselect" | "checkbox" | "radio" | "date" | "integration";

export interface ServiceFieldOption { value: string; label: string; }
export interface ServiceField {
  id: string;
  type: ServiceFieldType;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  options?: ServiceFieldOption[];
  integration?: string;
}

export interface MarketingServiceDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ServiceCategoryId;
  icon: string;
  status: ServiceStatus;
  enabled: boolean;
  features: { enabled: boolean; onboarding: boolean; production: boolean };
  highlights: string[];
  onboarding: { fields: ServiceField[] };
}
