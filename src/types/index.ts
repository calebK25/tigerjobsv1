
export type InterviewStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  major?: string;
}

export interface Interview {
  id: string;
  userId: string;
  company: string;
  role: string;
  dateApplied: string;
  status: InterviewStatus;
  notes?: string;
  nextInterviewDate?: string;
  location?: string;
  salary?: string;
  platform?: string;
  source?: 'manual' | 'email' | 'recommendation' | 'import';
}

export interface JobRecommendation {
  id: string;
  company: string;
  role: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  source: string;
  relevanceScore?: number;
}

export interface SankeyNode {
  id: string;
  name: string;
  category: 'major' | 'company' | 'role' | 'status';
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface DashboardMetrics {
  totalApplications: number;
  upcomingInterviews: number;
  offersReceived: number;
  rejectionRate: number;
  averageResponseTime: number;
}
