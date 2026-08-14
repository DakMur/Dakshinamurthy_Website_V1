export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface DomainContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string; // Lucide icon identifier
  summary: string;
  description: string;
  quote: string;
  quoteAuthor?: string;
  image: string;
  practiceTitle?: string;
  practiceSteps?: string[];
  energyIndicator?: string;
  relatedSlugs?: string[];
}

export interface Article {
  id: string;
  domainSlug: string;
  title: string;
  subtitle: string;
  content: string;
  author?: string;
  readTime?: string;
  image: string;
  images?: string[];
  date?: string;
  likes?: number;
  views?: number;
  quote?: string;
  translation?: string;
  headerLabel?: string;
  actionText?: string;
  buttonText?: string;
  hideMeta?: boolean;
  hidden?: boolean;
  category?: string;
  tag?: string;
  excerpt?: string;
  paragraphs?: string[];
}

export interface TimelineStep {
  id: string;
  order: number;
  stage: string; // e.g., 'Awakening', 'Seeking Knowledge'
  title: string;
  subtitle: string;
  description: string;
  quote: string;
  quoteAuthor?: string;
  image: string;
  milestone: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export interface AnalyticsStats {
  pageViews: {
    home: number;
    storytelling: number;
    domains: number;
    flow: number;
    admin: number;
  };
  totalInteractions: number;
  totalComments: number;
  activeSessions: number;
  usersByRole: {
    admin: number;
    user: number;
  };
}

export interface RegistrationConfig {
  status: 'Registration Not Yet Opened' | 'Registration Open' | 'Registrations Closed';
  openDate?: string;
  closeDate?: string;
  minMembers: number;
  maxMembers: number;
  disableTeamLogin?: boolean;
  allowDocumentUpload?: boolean;
  allowMemberEdits?: boolean;
}

export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  college_name?: string;
  semester?: number;
}

export interface Team {
  id: string;
  teamName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: TeamMember[];
  documentUrl?: string;
  demoVideoUrl?: string;
  passed_round?: number;
}

export interface Notice {
  id: string;
  title: string;
  short_description: string;
  full_content: string;
  is_published: boolean;
  created_at: string;
}
