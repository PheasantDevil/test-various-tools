import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  requestReview,
} from '../services/github/pullRequestService';
import { getRecentRepositories, saveRecentRepository } from '../utils/storage';

interface GitHubContextType {
  owner: string;
  repo: string;
  issues: Issue[];
  pullRequests: PullRequest[];
  loading: boolean;
  error: string | null;
  recentRepositories: { owner: string; repo: string }[];
  setOwnerRepo: (owner: string, repo: string) => void;
  fetchIssues: () => Promise<void>;
  fetchPullRequests: () => Promise<void>;
  handleCloseIssue: (issueNumber: number) => Promise<void>;
  handleReopenIssue: (issueNumber: number) => Promise<void>;
  handleClosePR: (prNumber: number) => Promise<void>;
  handleRequestReview: (prNumber: number, reviewers: string[]) => Promise<void>;
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
  const [recentRepositories, setRecentRepositories] = useState<
    { owner: string; repo: string }[]
  >([]);

  useEffect(() => {
    setRecentRepositories(getRecentRepositories());
  }, []);

  const setOwnerRepo = (newOwner: string, newRepo: string) => {
    setOwner(newOwner);
    setRepo(newRepo);
    saveRecentRepository(newOwner, newRepo);
    setRecentRepositories(getRecentRepositories());
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

  const handleRequestReview = async (prNumber: number, reviewers: string[]) => {
    if (!owner || !repo) return;

    setLoading(true);
    setError(null);

    try {
      await requestReview(owner, repo, prNumber, reviewers);
      await fetchPullRequests();
    } catch (err) {
      setError('Failed to request review');
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
        recentRepositories,
        setOwnerRepo,
        fetchIssues,
        fetchPullRequests,
        handleCloseIssue,
        handleReopenIssue,
        handleClosePR,
        handleRequestReview,
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
