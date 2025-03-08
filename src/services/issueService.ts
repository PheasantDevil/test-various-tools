import { githubApiClient } from '../../utils/api';

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export const getIssues = async (
  owner: string,
  repo: string,
): Promise<Issue[]> => {
  const response = await githubApiClient.get(
    `/repos/${owner}/${repo}/issues?state=all`,
  );
  return response.data;
};

export const closeIssue = async (
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<Issue> => {
  const response = await githubApiClient.patch(
    `/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      state: 'closed',
    },
  );
  return response.data;
};

export const reopenIssue = async (
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<Issue> => {
  const response = await githubApiClient.patch(
    `/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      state: 'open',
    },
  );
  return response.data;
};
