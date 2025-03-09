import React, { memo } from 'react';
import { Issue } from 'services/issueService';
import { formatDate } from '../../../utils/dateUtils';
import './IssueCard.scss';

interface IssueCardProps {
  issue: Issue;
  onClose: (issueNumber: number) => void;
  onReopen: (issueNumber: number) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClose, onReopen }) => {
  return (
    <div className="issue-card">
      <h3>
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Issue #${issue.number}: ${issue.title}. 新しいタブで開きます。`}
        >
          #{issue.number} {issue.title}
        </a>
      </h3>
      <div className="issue-meta">
        <span>作成者: {issue.user.login}</span>
        <span>作成日時: {formatDate(issue.created_at)}</span>
        <span>
          状態: {issue.state === 'open' ? '開いています' : '閉じています'}
        </span>
      </div>
      <div className="issue-actions">
        {issue.state === 'open' ? (
          <button
            onClick={() => onClose(issue.number)}
            tabIndex={0}
            aria-label={`Issue #${issue.number} を閉じる`}
          >
            Close Issue
          </button>
        ) : (
          <button onClick={() => onReopen(issue.number)}>Reopen Issue</button>
        )}
      </div>
    </div>
  );
};

export default memo(IssueCard);
