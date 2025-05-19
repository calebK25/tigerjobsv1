import { Interview, JobRecommendation, User, SankeyData, DashboardMetrics } from '../types';

// Mock User
export const currentUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.johnson@university.edu',
  photoURL: 'https://i.pravatar.cc/150?img=11',
  major: 'Computer Science'
};

// Mock Interviews
export const mockInterviews: Interview[] = [
  {
    id: 'i1',
    userId: 'u1',
    company: 'Google',
    role: 'Software Engineer Intern',
    dateApplied: '2025-03-15',
    status: 'Interviewing',
    notes: 'First technical interview scheduled for next week',
    nextInterviewDate: '2025-04-22',
    location: 'Mountain View, CA',
    source: 'manual'
  },
  {
    id: 'i2',
    userId: 'u1',
    company: 'Microsoft',
    role: 'Product Manager Intern',
    dateApplied: '2025-03-10',
    status: 'Applied',
    notes: 'Submitted application through university career portal',
    source: 'manual'
  },
  {
    id: 'i3',
    userId: 'u1',
    company: 'Amazon',
    role: 'Software Development Engineer',
    dateApplied: '2025-02-28',
    status: 'Rejected',
    notes: 'Rejected after phone screen',
    source: 'email'
  },
  {
    id: 'i4',
    userId: 'u1',
    company: 'Apple',
    role: 'UX Engineer Intern',
    dateApplied: '2025-03-05',
    status: 'Offer',
    notes: 'Offer received! $45/hr, 12 weeks',
    salary: '$45/hr',
    source: 'recommendation'
  },
  {
    id: 'i5',
    userId: 'u1',
    company: 'Meta',
    role: 'Frontend Engineer Intern',
    dateApplied: '2025-03-12',
    status: 'Interviewing',
    nextInterviewDate: '2025-04-25',
    location: 'Remote',
    source: 'manual'
  }
];

// Mock Job Recommendations
export const mockRecommendations: JobRecommendation[] = [
  {
    id: 'r1',
    company: 'Netflix',
    role: 'Software Engineer Intern',
    location: 'Los Gatos, CA',
    description: 'Join our streaming platform team to develop scalable solutions for millions of users.',
    url: 'https://example.com/job1',
    postedDate: '2025-04-10',
    source: 'Indeed',
    relevanceScore: 95
  },
  {
    id: 'r2',
    company: 'Spotify',
    role: 'Backend Developer Intern',
    location: 'New York, NY',
    description: 'Work on our music streaming infrastructure and help scale our services.',
    url: 'https://example.com/job2',
    postedDate: '2025-04-12',
    source: 'LinkedIn',
    relevanceScore: 90
  },
  {
    id: 'r3',
    company: 'Adobe',
    role: 'UI/UX Design Intern',
    location: 'San Francisco, CA',
    description: 'Help design the next generation of creative tools.',
    url: 'https://example.com/job3',
    postedDate: '2025-04-08',
    source: 'GitHub Internship List',
    relevanceScore: 85
  },
  {
    id: 'r4',
    company: 'IBM',
    role: 'Machine Learning Engineer Intern',
    location: 'Remote',
    description: 'Develop ML models to solve business problems.',
    url: 'https://example.com/job4',
    postedDate: '2025-04-15',
    source: 'University Portal',
    relevanceScore: 88
  }
];

// Updated Sankey Data with correct node categories
export const mockSankeyData: SankeyData = {
  nodes: [
    // Initial Status
    { id: 'applied', name: 'Applied', category: 'status' },
    { id: 'interviewing', name: 'Interviewing', category: 'status' },
    
    // Final Outcomes
    { id: 'offer', name: 'Offer', category: 'status' },
    { id: 'rejected', name: 'Rejected', category: 'status' },
    { id: 'ghost', name: 'No Response', category: 'status' }
  ],
  links: [
    // Applied to outcomes
    { source: 'applied', target: 'interviewing', value: 3 },
    { source: 'applied', target: 'rejected', value: 1 },
    { source: 'applied', target: 'ghost', value: 1 },
    
    // Interviewing to outcomes
    { source: 'interviewing', target: 'offer', value: 2 },
    { source: 'interviewing', target: 'rejected', value: 1 }
  ]
};

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalApplications: 5,
  upcomingInterviews: 2,
  offersReceived: 1,
  rejectionRate: 20,
  averageResponseTime: 7.5
};
