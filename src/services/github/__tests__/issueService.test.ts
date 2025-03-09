import { githubApiClient } from '../../../utils/api';
import { closeIssue, getIssues, reopenIssue } from '../issueService';

jest.mock('../../../utils/api');

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
      '/repos/owner/repo/issues?state=all',
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
