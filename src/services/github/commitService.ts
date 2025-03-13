import { Octokit } from '@octokit/rest';
import { getGitHubToken } from '../../utils/tokenUtils';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export const getLatestCommits = async (limit = 5): Promise<Commit[]> => {
  try {
    const token = getGitHubToken();
    if (!token) {
      throw new Error('GitHub token not found');
    }

    const octokit = new Octokit({ auth: token });

    const response = await octokit.repos.listCommits({
      owner: process.env.REACT_APP_GITHUB_OWNER || '',
      repo: process.env.REACT_APP_GITHUB_REPO || '',
      per_page: limit,
    });

    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name || 'Unknown',
      date: commit.commit.author?.date || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    throw error;
  }
};
