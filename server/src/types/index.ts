export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  password?: string;
}

export interface DomainContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  description: string;
  quote: string;
  quoteAuthor?: string;
  image?: string;
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
  hideMeta?: boolean;
  hidden?: boolean;
}

export interface TimelineStep {
  id: string;
  order: number;
  stage: string;
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

export interface DatabaseSchema {
  users: User[];
  domains: DomainContent[];
  articles: Article[];
  timeline: TimelineStep[];
  comments: Comment[];
  quotes: Quote[];
  analytics: AnalyticsStats;
  teams?: any[];
  members?: any[];
  registrationConfig?: any;
}
