declare module '../services/github/commitService' {
  interface Commit {
    sha: string;
    message: string;
    author: string;
    date: string;
  }

  export class GitHubError extends Error {
    constructor(message: string);
  }

  export function getLatestCommits(limit?: number): Promise<Commit[]>;
}
