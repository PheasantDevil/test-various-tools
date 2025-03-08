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
  reviews: {
    user: {
      login: string;
    };
    state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
    submitted_at: string;
  }[];
}

export const getPullRequests = async (
  owner: string,
  repo: string,
): Promise<PullRequest[]> => {
  const response = await githubApiClient.get(
    `/repos/${owner}/${repo}/pulls?state=all`,
  );
  const pullRequests = response.data;

  // 各PRのレビュー情報を取得
  for (const pr of pullRequests) {
    const reviewsResponse = await githubApiClient.get(
      `/repos/${owner}/${repo}/pulls/${pr.number}/reviews`,
    );
    pr.reviews = reviewsResponse.data;
  }

  return pullRequests;
};

export const closePullRequest = async (
  owner: string,
  repo: string,
  prNumber: number,
): Promise<PullRequest> => {
  const response = await githubApiClient.patch(
    `/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      state: 'closed',
    },
  );
  return response.data;
};

export const reopenPullRequest = async (
  owner: string,
  repo: string,
  prNumber: number,
): Promise<PullRequest> => {
  // PRの再オープンはAPIで直接サポートされていないため、新しいPRを作成する必要がある
  // 実際の実装では、元のPRの情報を取得して新しいPRを作成するロジックが必要
  throw new Error('Reopen PR functionality not implemented yet');
};

export const requestReview = async (
  owner: string,
  repo: string,
  prNumber: number,
  reviewers: string[],
): Promise<PullRequest> => {
  const response = await githubApiClient.post(
    `/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`,
    {
      reviewers,
    },
  );
  return response.data;
};
