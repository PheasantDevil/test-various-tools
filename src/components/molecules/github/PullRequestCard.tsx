import React, { useState } from 'react';
import { PullRequest } from '../../../services/github/pullRequestService';
import { formatDate } from '../../../utils/dateUtils';
import './PullRequestCard.scss';

interface PullRequestCardProps {
  pullRequest: PullRequest;
  onClose: (prNumber: number) => void;
  onRequestReview: (prNumber: number, reviewers: string[]) => void;
}

const PullRequestCard: React.FC<PullRequestCardProps> = ({
  pullRequest,
  onClose,
  onRequestReview,
}) => {
  const isApproved = pullRequest.reviews?.some(
    review => review.state === 'APPROVED',
  );

  const [reviewerInput, setReviewerInput] = useState<string>('');

  const handleReviewRequest = () => {
    if (!reviewerInput.trim()) return;
    const reviewers = reviewerInput.split(',').map(r => r.trim());
    onRequestReview(pullRequest.number, reviewers);
    setReviewerInput('');
  };

  return (
    <div className="pr-card">
      <h3>
        <a
          href={pullRequest.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          #{pullRequest.number} {pullRequest.title}
        </a>
      </h3>
      <div className="pr-meta">
        <span>作成者: {pullRequest.user.login}</span>
        <span>作成日時: {formatDate(pullRequest.created_at)}</span>
        <span>
          状態: {pullRequest.state === 'open' ? '開いています' : '閉じています'}
        </span>
        <span>承認状態: {isApproved ? '承認済み' : '未承認'}</span>
      </div>
      <div className="pr-reviewers">
        <h4>レビュアー:</h4>
        {pullRequest.requested_reviewers?.length > 0 ? (
          <ul>
            {pullRequest.requested_reviewers.map(reviewer => (
              <li key={reviewer.login}>{reviewer.login}</li>
            ))}
          </ul>
        ) : (
          <p>レビュアーはいません</p>
        )}
      </div>
      <div className="pr-actions">
        {pullRequest.state === 'open' && (
          <button onClick={() => onClose(pullRequest.number)}>Close PR</button>
        )}
      </div>
      <div className="pr-review-request">
        <h4>レビュー依頼</h4>
        <input
          type="text"
          value={reviewerInput}
          onChange={e => setReviewerInput(e.target.value)}
          placeholder="レビュアーのGitHubユーザー名を入力"
        />
        <button onClick={handleReviewRequest}>レビュー依頼</button>
      </div>
    </div>
  );
};

export default PullRequestCard;
