import { githubApiClient } from '../../../utils/api';
import {
  closePullRequest,
  getPullRequests,
  requestReview,
} from '../pullRequestService';

jest.mock('../../../utils/api');

describe('pullRequestService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getPullRequests should fetch PRs and their reviews', async () => {
    const mockPRs = [
      {
        id: 1,
        number: 101,
        title: 'Test PR',
        state: 'open',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        html_url: 'https://github.com/owner/repo/pull/101',
        user: {
          login: 'testuser',
          avatar_url: 'https://github.com/testuser.png',
        },
        requested_reviewers: [],
      },
    ];

    const mockReviews = [
      {
        user: {
          login: 'reviewer',
        },
        state: 'APPROVED',
        submitted_at: '2023-01-03T00:00:00Z',
      },
    ];

    (githubApiClient.get as jest.Mock).mockImplementation(url => {
      if (url === '/repos/owner/repo/pulls?state=all') {
        return Promise.resolve({ data: mockPRs });
      } else if (url === '/repos/owner/repo/pulls/101/reviews') {
        return Promise.resolve({ data: mockReviews });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const result = await getPullRequests('owner', 'repo');

    expect(githubApiClient.get).toHaveBeenCalledWith(
      '/repos/owner/repo/pulls?state=all',
    );
    expect(githubApiClient.get).toHaveBeenCalledWith(
      '/repos/owner/repo/pulls/101/reviews',
    );
    expect(result[0].reviews).toEqual(mockReviews);
  });

  test('closePullRequest should update PR state to closed', async () => {
    const mockPR = {
      id: 1,
      number: 101,
      state: 'closed',
    };

    (githubApiClient.patch as jest.Mock).mockResolvedValueOnce({
      data: mockPR,
    });

    const result = await closePullRequest('owner', 'repo', 101);

    expect(githubApiClient.patch).toHaveBeenCalledWith(
      '/repos/owner/repo/pulls/101',
      { state: 'closed' },
    );
    expect(result).toEqual(mockPR);
  });

  test('requestReview should request reviewers for a PR', async () => {
    const mockPR = {
      id: 1,
      number: 101,
      requested_reviewers: [{ login: 'reviewer1' }, { login: 'reviewer2' }],
    };

    (githubApiClient.post as jest.Mock).mockResolvedValueOnce({
      data: mockPR,
    });

    const reviewers = ['reviewer1', 'reviewer2'];
    const result = await requestReview('owner', 'repo', 101, reviewers);

    expect(githubApiClient.post).toHaveBeenCalledWith(
      '/repos/owner/repo/pulls/101/requested_reviewers',
      { reviewers },
    );
    expect(result).toEqual(mockPR);
  });
});
