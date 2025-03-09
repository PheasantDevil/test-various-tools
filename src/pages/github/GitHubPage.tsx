import ErrorMessage from 'components/atoms/ErrorMessage';
import LoadingSpinner from 'components/atoms/LoadingSpinner';
import React, { useEffect, useState } from 'react';
import IssueCard from '../../components/molecules/github/IssueCard';
import PullRequestCard from '../../components/molecules/github/PullRequestCard';
import { useGitHub } from '../../contexts/GitHubContext';
import './GitHubPage.scss';

const GitHubPage: React.FC = () => {
  const {
    owner,
    repo,
    issues,
    pullRequests,
    loading,
    error,
    setOwnerRepo,
    fetchIssues,
    fetchPullRequests,
    handleCloseIssue,
    handleReopenIssue,
    handleClosePR,
    handleRequestReview,
    recentRepositories,
  } = useGitHub();

  const [ownerInput, setOwnerInput] = useState(owner);
  const [repoInput, setRepoInput] = useState(repo);
  const [activeTab, setActiveTab] = useState<'issues' | 'prs'>('issues');
  const [issueFilter, setIssueFilter] = useState<'all' | 'open' | 'closed'>(
    'all',
  );
  const [prFilter, setPrFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [reviewerInput, setReviewerInput] = useState<string>('');

  useEffect(() => {
    if (owner && repo) {
      fetchIssues();
      fetchPullRequests();
    }
  }, [owner, repo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerRepo(ownerInput, repoInput);
  };

  const filteredIssues = issues.filter(issue => {
    if (issueFilter === 'all') return true;
    return issue.state === issueFilter;
  });

  const filteredPRs = pullRequests.filter(pr => {
    if (prFilter === 'all') return true;
    return pr.state === prFilter;
  });

  const handleReviewRequest = (prNumber: number) => {
    if (!reviewerInput.trim()) return;
    const reviewers = reviewerInput.split(',').map(r => r.trim());
    handleRequestReview(prNumber, reviewers);
    setReviewerInput('');
  };

  return (
    <div className="github-page">
      <h1>GitHub 管理</h1>

      <form onSubmit={handleSubmit} aria-labelledby="repo-form-title">
        <h2 id="repo-form-title">リポジトリ設定</h2>
        <div className="form-group">
          <label htmlFor="owner" id="owner-label">
            オーナー:
          </label>
          <input
            id="owner"
            type="text"
            value={ownerInput}
            onChange={e => setOwnerInput(e.target.value)}
            aria-labelledby="owner-label"
            aria-required="true"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="repo" id="repo-label">
            リポジトリ:
          </label>
          <input
            id="repo"
            type="text"
            value={repoInput}
            onChange={e => setRepoInput(e.target.value)}
            aria-labelledby="repo-label"
            aria-required="true"
            required
          />
        </div>
        <button type="submit" aria-label="リポジトリを設定">
          リポジトリを設定
        </button>
      </form>

      {/* 最近使用したリポジトリ */}
      {recentRepositories.length > 0 && (
        <div className="recent-repos">
          <h3>最近使用したリポジトリ</h3>
          <ul>
            {recentRepositories.map((repo, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setOwnerInput(repo.owner);
                    setRepoInput(repo.repo);
                    setOwnerRepo(repo.owner, repo.repo);
                  }}
                >
                  {repo.owner}/{repo.repo}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            if (owner && repo) {
              fetchIssues();
              fetchPullRequests();
            }
          }}
        />
      )}
      {loading ? (
        <LoadingSpinner />
      ) : (
        owner &&
        repo && (
          <>
            <div className="tabs" role="tablist" aria-label="GitHub 情報タブ">
              <button
                role="tab"
                aria-selected={activeTab === 'issues'}
                aria-controls="issues-panel"
                id="issues-tab"
                className={activeTab === 'issues' ? 'active' : ''}
                onClick={() => setActiveTab('issues')}
              >
                Issues
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'prs'}
                aria-controls="prs-panel"
                id="prs-tab"
                className={activeTab === 'prs' ? 'active' : ''}
                onClick={() => setActiveTab('prs')}
              >
                Pull Requests
              </button>
            </div>

            {activeTab === 'issues' && (
              <div
                id="issues-panel"
                role="tabpanel"
                aria-labelledby="issues-tab"
                tabIndex={0}
              >
                <div className="filter-controls">
                  <div className="filter-group">
                    <label htmlFor="issue-filter">フィルター:</label>
                    <select
                      id="issue-filter"
                      value={issueFilter}
                      onChange={e =>
                        setIssueFilter(
                          e.target.value as 'all' | 'open' | 'closed',
                        )
                      }
                    >
                      <option value="all">すべて</option>
                      <option value="open">開いている</option>
                      <option value="closed">閉じている</option>
                    </select>
                  </div>
                </div>

                <div className="issues-list">
                  <h2>Issues</h2>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        onClose={handleCloseIssue}
                        onReopen={handleReopenIssue}
                      />
                    ))
                  ) : (
                    <p>Issueはありません</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'prs' && (
              <div
                id="prs-panel"
                role="tabpanel"
                aria-labelledby="prs-tab"
                tabIndex={0}
              >
                <div className="filter-controls">
                  <div className="filter-group">
                    <label htmlFor="pr-filter">フィルター:</label>
                    <select
                      id="pr-filter"
                      value={prFilter}
                      onChange={e =>
                        setPrFilter(e.target.value as 'all' | 'open' | 'closed')
                      }
                    >
                      <option value="all">すべて</option>
                      <option value="open">開いている</option>
                      <option value="closed">閉じている</option>
                    </select>
                  </div>
                </div>

                <div className="prs-list">
                  <h2>Pull Requests</h2>
                  {filteredPRs.length > 0 ? (
                    filteredPRs.map(pr => (
                      <PullRequestCard
                        key={pr.id}
                        pullRequest={pr}
                        onClose={handleClosePR}
                        onRequestReview={handleReviewRequest}
                      />
                    ))
                  ) : (
                    <p>Pull Requestはありません</p>
                  )}
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default GitHubPage;
