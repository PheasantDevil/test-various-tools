import React, { ReactNode, createContext, useContext, useState } from 'react';
import {
  Issue,
  closeIssue,
  getIssues,
  reopenIssue,
} from '../services/github/issueService';
import {
  PullRequest,
  closePullRequest,
  getPullRequests,
} from '../services/github/pullRequestService';

interface GitHubContextType {
  owner: string;
  repo: string;
  issues: Issue[];
  pullRequests: PullRequest[];
  loading: boolean;
  error: string | null;
  setOwnerRepo: (owner: string, repo: string) => void;
  fetchIssues: () => Promise<void>;
  fetchPullRequests: () => Promise<void>;
  handleCloseIssue: (issueNumber: number) => Promise<void>;
  handleReopenIssue: (issueNumber: number) => Promise<void>;
  handleClosePR: (prNumber: number) => Promise<void>;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setOwnerRepo = (newOwner: string, newRepo: string) => {
    setOwner(newOwner);
    setRepo(newRepo);
  };

  const fetchIssues = async () => {
    if (!owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getIssues(owner, repo);
      setIssues(data);
    } catch (err) {
      setError('Failed to fetch issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPullRequests = async () => {
    if (!owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPullRequests(owner, repo);
      setPullRequests(data);
    } catch (err) {
      setError('Failed to fetch pull requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseIssue = async (issueNumber: number) => {
    if (!owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      await closeIssue(owner, repo, issueNumber);
      await fetchIssues();
    } catch (err) {
      setError('Failed to close issue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReopenIssue = async (issueNumber: number) => {
    if (!owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      await reopenIssue(owner, repo, issueNumber);
      await fetchIssues();
    } catch (err) {
      setError('Failed to reopen issue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePR = async (prNumber: number) => {
    if (!owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      await closePullRequest(owner, repo, prNumber);
      await fetchPullRequests();
    } catch (err) {
      setError('Failed to close pull request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GitHubContext.Provider
      value={{
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
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};
