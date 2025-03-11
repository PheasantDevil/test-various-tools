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
  try {
    const response = await githubApiClient.get(
      `/repos/${owner}/${repo}/issues`,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    throw error;
  }
};

export const closeIssue = async (
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<Issue> => {
  try {
    const response = await githubApiClient.patch(
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        state: 'closed',
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to close issue:', error);
    throw error;
  }
};

export const reopenIssue = async (
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<Issue> => {
  try {
    const response = await githubApiClient.patch(
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        state: 'open',
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to reopen issue:', error);
    throw error;
  }
};
