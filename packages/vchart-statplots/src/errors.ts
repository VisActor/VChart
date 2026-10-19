import type { StatPlotIssue } from './common/types';

export class StatPlotValidationError extends Error {
  readonly issues: StatPlotIssue[];
  constructor(issues: StatPlotIssue[]) {
    super(issues.map(issue => `${issue.path || '/'}: ${issue.message}`).join('\n'));
    this.name = 'StatPlotValidationError';
    this.issues = issues;
  }
}
