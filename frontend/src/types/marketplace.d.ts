export interface MarketplaceProjectCard {
  id: number;
  name: string;
  description: string;
  category: string | null;
  project_type: string;
  academic_year: string | null;
  technology_names: string[];
  member_count: number;
  supervisor_count: number;
  repository_url: string;
  documentation_url: string;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceProjectDetail {
  id: number;
  name: string;
  description: string;
  project_type: string;
  methodology: string;
  status: string;
  proposal: string;
  abstract: string;
  expected_scope: string;
  archive_year: number | null;
  category: string | null;
  subject: string | null;
  semester: string | null;
  academic_year: string | null;
  technology_names: string[];
  members: MarketplaceMember[];
  supervisors: MarketplaceSupervisor[];
  member_count: number;
  technology_count: number;
  supervisor_count: number;
  repository_url: string;
  documentation_url: string;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceMember {
  id: number;
  name: string;
  role: string;
}

export interface MarketplaceSupervisor {
  id: number;
  name: string;
  role: string;
}

export interface MarketplaceFilter {
  search: string;
  category: string;
  technology: string;
  project_type: string;
  academic_year: string;
}

export interface MarketplaceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MarketplaceProjectCard[];
}

export interface Technology {
  id: number;
  name: string;
  is_official: boolean;
}

export interface Category {
  id: number;
  name: string;
}
