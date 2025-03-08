import React, { useEffect, useState } from 'react';
import IssueCard from '../../components/molecules/github/IssueCard';
import PullRequestCard from '../../components/molecules/github/PullRequestCard';
import { useGitHub } from '../../contexts/GitHubContext';

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
  } = useGitHub();

  const [ownerInput, setOwnerInput] = useState(owner);
  const [repoInput, setRepoInput] = useState(repo);
  const [activeTab, setActiveTab] = useState<'issues' | 'prs'>('issues');
  const [issueFilter, setIssueFilter] = useState<'all' | 'open' | 'closed'>(
    'all',
  );
  const [prFilter, setPrFilter] = useState<'all' | 'open' | 'closed'>('all');

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

  return (
    <div className="github-page">
      <h1>GitHub 管理</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="owner">オーナー:</label>
          <input
            id="owner"
            type="text"
            value={ownerInput}
            onChange={e => setOwnerInput(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="repo">リポジトリ:</label>
          <input
            id="repo"
            type="text"
            value={repoInput}
            onChange={e => setRepoInput(e.target.value)}
            required
          />
        </div>
        <button type="submit">リポジトリを設定</button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
        owner &&
        repo && (
          <>
            <div className="tabs">
              <button
                className={activeTab === 'issues' ? 'active' : ''}
                onClick={() => setActiveTab('issues')}
              >
                Issues
              </button>
              <button
                className={activeTab === 'prs' ? 'active' : ''}
                onClick={() => setActiveTab('prs')}
              >
                Pull Requests
              </button>
            </div>

            {activeTab === 'issues' && (
              <div className="issues-list">
                <h2>Issues</h2>
                {issues.length > 0 ? (
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
            )}

            {activeTab === 'prs' && (
              <div className="prs-list">
                <h2>Pull Requests</h2>
                {pullRequests.length > 0 ? (
                  filteredPRs.map(pr => (
                    <PullRequestCard
                      key={pr.id}
                      pullRequest={pr}
                      onClose={handleClosePR}
                    />
                  ))
                ) : (
                  <p>Pull Requestはありません</p>
                )}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default GitHubPage;
