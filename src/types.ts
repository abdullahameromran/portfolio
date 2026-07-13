export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  techStack: string[];
  metrics: string[];
  features: string[];
  dbStructure?: {
    table: string;
    fields: string[];
  }[];
  isDraft?: boolean;
  imageUrl?: string;
  images?: string[];
  websiteUrl?: string;
}

export interface EstimatorItem {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'database' | 'integration' | 'marketing';
  hours: number;
  complexity: 'Low' | 'Medium' | 'High';
}
