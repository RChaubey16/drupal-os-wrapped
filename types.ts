export interface Issue {
  id: string;
  title: string;
  project: string;
  createdAt: string; // ISO Date
  status: 'open' | 'closed' | 'merged';
  labels: string[];
  comments: number;
  url: string;
}

export interface ProjectStats {
  id: string;
  name: string;
  icon: string; // URL or emoji
  totalIssues: number;
  percentage: number;
  topMetric: string; // e.g., "Most Active"
  description: string;
}

export interface MonthlyStat {
  month: string;
  count: number;
}

export interface UserYearData {
  userId: string;
  userName: string;
  totalIssues: number;
  topProject: ProjectStats;
  issues: Issue[];
  monthlyStats: MonthlyStat[];
}

export type ThemeType = 'bright' | 'muted';

export interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}