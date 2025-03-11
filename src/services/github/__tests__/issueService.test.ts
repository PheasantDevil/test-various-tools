import { githubApiClient } from '../../../utils/api';

// モックの設定
jest.mock('../../../utils/api');

// テスト対象の関数を定義
const getIssues = async (owner: string, repo: string) => {
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

const closeIssue = async (owner: string, repo: string, issueNumber: number) => {
  try {
    const response = await githubApiClient.patch(
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      { state: 'closed' },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to close issue:', error);
    throw error;
  }
};

const reopenIssue = async (
  owner: string,
  repo: string,
  issueNumber: number,
) => {
  try {
    const response = await githubApiClient.patch(
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      { state: 'open' },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to reopen issue:', error);
    throw error;
  }
};

describe('issueService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getIssues should fetch issues from GitHub API', async () => {
    const mockIssues = [
      {
        id: 1,
        number: 101,
        title: 'Test Issue',
        state: 'open',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        html_url: 'https://github.com/owner/repo/issues/101',
        user: {
          login: 'testuser',
          avatar_url: 'https://github.com/testuser.png',
        },
      },
    ];

    (githubApiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockIssues,
    });

    const result = await getIssues('owner', 'repo');

    expect(githubApiClient.get).toHaveBeenCalledWith(
      '/repos/owner/repo/issues',
    );
    expect(result).toEqual(mockIssues);
  });

  test('closeIssue should update issue state to closed', async () => {
    const mockIssue = {
      id: 1,
      number: 101,
      state: 'closed',
    };

    (githubApiClient.patch as jest.Mock).mockResolvedValueOnce({
      data: mockIssue,
    });

    const result = await closeIssue('owner', 'repo', 101);

    expect(githubApiClient.patch).toHaveBeenCalledWith(
      '/repos/owner/repo/issues/101',
      { state: 'closed' },
    );
    expect(result).toEqual(mockIssue);
  });

  test('reopenIssue should update issue state to open', async () => {
    const mockIssue = {
      id: 1,
      number: 101,
      state: 'open',
    };

    (githubApiClient.patch as jest.Mock).mockResolvedValueOnce({
      data: mockIssue,
    });

    const result = await reopenIssue('owner', 'repo', 101);

    expect(githubApiClient.patch).toHaveBeenCalledWith(
      '/repos/owner/repo/issues/101',
      { state: 'open' },
    );
    expect(result).toEqual(mockIssue);
  });

  test('getIssues should handle API errors', async () => {
    (githubApiClient.get as jest.Mock).mockRejectedValueOnce(
      new Error('API Error'),
    );

    await expect(getIssues('owner', 'repo')).rejects.toThrow('API Error');
  });

  // 他のテスト
});
