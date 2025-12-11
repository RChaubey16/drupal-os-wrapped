import { DrupalApiResponse } from '../api/drupal';
import { UserYearData, Issue, MonthlyStat, ProjectStats } from '../types';

const getStatus = (statusCode: number): 'open' | 'closed' | 'merged' => {
  // Drupal issue status codes mappings
  // 1: Active, 13: Needs work, 8: Needs review, 14: Reviewed & tested by the community, 4: Postponed, 16: Postponed (maintainer needs more info)
  // 2: Fixed, 7: Closed (fixed)
  // 3: Closed (outdated), 5: Closed (won't fix), 6: Closed (duplicate), 18: Closed (cannot reproduce)
  
  if ([2, 7].includes(statusCode)) return 'merged';
  if ([1, 13, 8, 14, 4, 16].includes(statusCode)) return 'open';
  return 'closed';
};

const getMonthName = (monthIndex: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
};

export const transformDrupalData = (response: DrupalApiResponse): UserYearData => {
  const { user, issues, topProject, totalCount } = response;

  // 1. Map Issues
  const mappedIssues: Issue[] = issues.map(issue => ({
    id: issue.nid,
    title: issue.title,
    project: issue.field_project?.machine_name || 'Drupal Project',
    createdAt: new Date(issue.created * 1000).toISOString().split('T')[0],
    status: getStatus(issue.field_issue_status),
    labels: [issue.type], // e.g. 'Bug', 'Feature request'
    comments: Number(issue.comment_count) || 0,
    url: `https://www.drupal.org/node/${issue.nid}`
  }));

  // 2. Calculate Monthly Stats
  const monthsData = new Array(12).fill(0);
  issues.forEach(issue => {
    const date = new Date(issue.created * 1000);
    monthsData[date.getMonth()]++;
  });
  
  const monthlyStats: MonthlyStat[] = monthsData.map((count, index) => ({
    month: getMonthName(index),
    count
  }));

  // 3. Top Project
  let projectStats: ProjectStats;
  
  if (topProject && totalCount > 0) {
    const percentage = Math.round((topProject.count / totalCount) * 100);
    projectStats = {
      id: 'top-project',
      name: topProject.name,
      icon: '💧', // Drupal Drop or generic
      totalIssues: topProject.count,
      percentage: percentage,
      topMetric: 'Most Active',
      description: `You focused ${percentage}% of your efforts here.`
    };
  } else {
    projectStats = {
      id: 'none',
      name: 'No Activity',
      icon: '🕸️',
      totalIssues: 0,
      percentage: 0,
      topMetric: 'Quiet Year',
      description: 'No specific project activity found for 2025.'
    };
  }

  return {
    userId: user.uid,
    userName: user.name,
    totalIssues: totalCount,
    topProject: projectStats,
    issues: mappedIssues,
    monthlyStats
  };
};