import { Octokit } from '@octokit/rest';
import { getGitHubToken } from '../../utils/tokenUtils';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export class GitHubError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubError';
  }
}

export const getLatestCommits = async (limit = 5): Promise<Commit[]> => {
  try {
    const token = getGitHubToken();
    if (!token) {
      throw new GitHubError('GitHub token not found');
    }

    const octokit = new Octokit({ auth: token });
    const owner = process.env['REACT_APP_GITHUB_OWNER'];
    const repo = process.env['REACT_APP_GITHUB_REPO'];

    if (!owner || !repo) {
      throw new GitHubError(
        'GitHub owner or repo not configured in environment variables',
      );
    }

    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: limit,
      });

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name || 'Unknown',
        date: commit.commit.author?.date || new Date().toISOString(),
      }));
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Bad credentials')) {
          throw new GitHubError('Invalid GitHub token');
        } else if (error.message.includes('Not Found')) {
          throw new GitHubError('Repository not found or access denied');
        }
      }
      throw new GitHubError('Failed to fetch commits from GitHub');
    }
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    throw error;
  }
};
