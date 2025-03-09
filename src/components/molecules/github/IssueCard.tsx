import React from 'react';
import { Issue } from '../../../services/github/issueService';
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
        <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
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
          <button onClick={() => onClose(issue.number)}>Close Issue</button>
        ) : (
          <button onClick={() => onReopen(issue.number)}>Reopen Issue</button>
        )}
      </div>
    </div>
  );
};

export default IssueCard;
