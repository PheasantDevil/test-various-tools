import { act, render, screen, waitFor } from '@testing-library/react';
import * as issueService from '../../services/github/issueService';
import * as prService from '../../services/github/pullRequestService';
import * as storageUtils from '../../utils/storage';
import { GitHubProvider, useGitHub } from '../GitHubContext';

jest.mock('../../services/github/issueService');
jest.mock('../../services/github/pullRequestService');
jest.mock('../../utils/storage');

// テスト用のコンポーネント
const TestComponent = () => {
  const {
    owner,
    repo,
    issues,
    loading,
    error,
    setOwnerRepo,
    fetchIssues,
    handleRequestReview,
  } = useGitHub();

  return (
    <div>
      <div data-testid="owner">{owner}</div>
      <div data-testid="repo">{repo}</div>
      <div data-testid="issues-count">{issues.length}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <button onClick={() => setOwnerRepo('test-owner', 'test-repo')}>
        Set Owner/Repo
      </button>
      <button onClick={() => fetchIssues()}>Fetch Issues</button>
      <button onClick={() => handleRequestReview(101, ['reviewer1'])}>
        Request Review
      </button>
    </div>
  );
};

describe('GitHubContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (storageUtils.getRecentRepositories as jest.Mock).mockReturnValue([]);
  });

  test('should provide initial values', () => {
    render(
      <GitHubProvider>
        <TestComponent />
      </GitHubProvider>,
    );

    expect(screen.getByTestId('owner')).toHaveTextContent('');
    expect(screen.getByTestId('repo')).toHaveTextContent('');
    expect(screen.getByTestId('issues-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
  });

  test('should update owner and repo when setOwnerRepo is called', () => {
    render(
      <GitHubProvider>
        <TestComponent />
      </GitHubProvider>,
    );

    act(() => {
      screen.getByText('Set Owner/Repo').click();
    });

    expect(screen.getByTestId('owner')).toHaveTextContent('test-owner');
    expect(screen.getByTestId('repo')).toHaveTextContent('test-repo');
    expect(storageUtils.saveRecentRepository).toHaveBeenCalledWith(
      'test-owner',
      'test-repo',
    );
  });

  test('should fetch issues when fetchIssues is called', async () => {
    const mockIssues = [
      { id: 1, number: 101 },
      { id: 2, number: 102 },
    ];

    (issueService.getIssues as jest.Mock).mockResolvedValueOnce(mockIssues);

    render(
      <GitHubProvider>
        <TestComponent />
      </GitHubProvider>,
    );

    // Set owner and repo first
    act(() => {
      screen.getByText('Set Owner/Repo').click();
    });

    // Then fetch issues
    act(() => {
      screen.getByText('Fetch Issues').click();
    });

    // Check loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that issues were loaded
    expect(screen.getByTestId('issues-count')).toHaveTextContent('2');
    expect(issueService.getIssues).toHaveBeenCalledWith(
      'test-owner',
      'test-repo',
    );
  });

  test('should request review when handleRequestReview is called', async () => {
    (prService.requestReview as jest.Mock).mockResolvedValueOnce({});
    (prService.getPullRequests as jest.Mock).mockResolvedValueOnce([]);

    render(
      <GitHubProvider>
        <TestComponent />
      </GitHubProvider>,
    );

    // Set owner and repo first
    act(() => {
      screen.getByText('Set Owner/Repo').click();
    });

    // Then request review
    act(() => {
      screen.getByText('Request Review').click();
    });

    // Check loading state
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Wait for the request to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that review was requested
    expect(prService.requestReview).toHaveBeenCalledWith(
      'test-owner',
      'test-repo',
      101,
      ['reviewer1'],
    );
    expect(prService.getPullRequests).toHaveBeenCalledWith(
      'test-owner',
      'test-repo',
    );
  });

  test('should handle errors when fetching issues fails', async () => {
    (issueService.getIssues as jest.Mock).mockRejectedValueOnce(
      new Error('API Error'),
    );

    render(
      <GitHubProvider>
        <TestComponent />
      </GitHubProvider>,
    );

    // Set owner and repo first
    act(() => {
      screen.getByText('Set Owner/Repo').click();
    });

    // Then fetch issues
    act(() => {
      screen.getByText('Fetch Issues').click();
    });

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    // Check that error was set
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Failed to fetch issues',
    );
  });
});
