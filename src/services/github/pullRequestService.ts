import { githubApiClient } from '../../utils/api';

export interface PullRequest {
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
  requested_reviewers: {
    login: string;
    avatar_url: string;
  }[];
  reviews?: {
    user: {
      login: string;
    };
    state: string;
    submitted_at: string;
  }[];
}

export const getPullRequests = async (
  owner: string,
  repo: string,
): Promise<PullRequest[]> => {
  try {
    const response = await githubApiClient.get(`/repos/${owner}/${repo}/pulls`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    throw error;
  }
};

export const getPullRequestReviews = async (
  owner: string,
  repo: string,
  prNumber: number,
): Promise<any[]> => {
  try {
    const response = await githubApiClient.get(
      `/repos/${owner}/${repo}/pulls/${prNumber}/reviews`,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch PR reviews:', error);
    throw error;
  }
};

export const closePullRequest = async (
  owner: string,
  repo: string,
  prNumber: number,
): Promise<PullRequest> => {
  try {
    const response = await githubApiClient.patch(
      `/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        state: 'closed',
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to close PR:', error);
    throw error;
  }
};

export const requestReview = async (
  owner: string,
  repo: string,
  prNumber: number,
  reviewers: string[],
): Promise<PullRequest> => {
  try {
    const response = await githubApiClient.post(
      `/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`,
      {
        reviewers,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to request review:', error);
    throw error;
  }
};
